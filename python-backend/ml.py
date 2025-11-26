import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
from get_all_users import get_all_users
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder, StandardScaler
import pandas as pd
import numpy as np
from flask import request, jsonify
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

def get_recommend_users(new_user, all_users_in_cluster, num_recommendations=5):

    ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    edu_ohe = ohe.fit_transform(all_users_in_cluster[['educationLevel']])
    new_edu_ohe = ohe.transform([[new_user['educationLevel']]])

    mlb_skills = MultiLabelBinarizer()
    skills_mlb = mlb_skills.fit_transform(all_users_in_cluster['skillsCanTeach'])
    new_skills_mlb = mlb_skills.transform([new_user['skillsCanTeach']])

    mlb_badges = MultiLabelBinarizer()
    badges_mlb = mlb_badges.fit_transform(all_users_in_cluster['badges'])
    new_badges_mlb = mlb_badges.transform([new_user['badges']])

    num_features = ['points','sessionsCompleted','questionsAnswered','rating']
    scaler = StandardScaler()
    df_num_scaled = scaler.fit_transform(all_users_in_cluster[num_features])
    new_num_scaled = scaler.transform([[new_user[feat] for feat in num_features]])

    df_features = np.hstack([edu_ohe, skills_mlb, badges_mlb, df_num_scaled])
    new_user_features = np.hstack([new_edu_ohe, new_skills_mlb, new_badges_mlb, new_num_scaled])

    similarities = cosine_similarity(new_user_features, df_features)[0]
    all_users_in_cluster = all_users_in_cluster.copy()
    all_users_in_cluster['similarity'] = (similarities * 100).round(2)

    top_similar_users = all_users_in_cluster.sort_values(by='similarity', ascending=False)

    available = min(num_recommendations, len(top_similar_users.head(20)))
    return top_similar_users.head(20).sample(n=available)[['_id', 'similarity']].to_dict(orient='records')

def use_k_means_model():

    data = request.get_json()
    new_user = data.get("user", {})
    num_recommendations = data.get("nums", 5)

    if(new_user == {}):
        return {"error": "No user data provided."}

    df = pd.DataFrame(get_all_users())
    df_features = df.drop('_id', axis=1)

    scaler = StandardScaler().fit(df_features[['points', 'sessionsCompleted', 'questionsAnswered', 'rating']])

    mlb_skills = MultiLabelBinarizer().fit(df_features['skillsCanTeach'])
    mlb_badges = MultiLabelBinarizer().fit(df_features['badges'])

    df_numerical = pd.DataFrame(
        scaler.transform(
            df_features[['points', 'sessionsCompleted', 'questionsAnswered', 'rating']]
        ), 
        columns=['points', 'sessionsCompleted', 'questionsAnswered', 'rating']
    )

    df_categorical = pd.get_dummies(df_features[['educationLevel']], prefix='edu')

    df_skills = pd.DataFrame(mlb_skills.transform(df_features['skillsCanTeach']), columns=mlb_skills.classes_)

    df_badges = pd.DataFrame(mlb_badges.transform(df_features['badges']), columns=mlb_badges.classes_)

    df_flattened_train = pd.concat([df_numerical, df_categorical, df_skills, df_badges], axis=1)

    K = 4
    kmeans = KMeans(n_clusters=K, random_state=42, n_init=10).fit(df_flattened_train)
    df['cluster'] = kmeans.labels_

    df_new = pd.DataFrame([new_user])

    new_numerical = pd.DataFrame(
        scaler.transform(
            df_new[['points', 'sessionsCompleted', 'questionsAnswered', 'rating']]
        ),
        columns=['points', 'sessionsCompleted', 'questionsAnswered', 'rating']
    )

    new_categorical = pd.get_dummies(df_new[['educationLevel']], prefix='edu')
    new_skills = pd.DataFrame(mlb_skills.transform(df_new['skillsCanTeach']), columns=mlb_skills.classes_)
    new_badges = pd.DataFrame(mlb_badges.transform(df_new['badges']), columns=mlb_badges.classes_)

    df_flattened_new = pd.concat([new_numerical, new_categorical, new_skills, new_badges], axis=1)

    final_new_user_data, _ = df_flattened_new.align(df_flattened_train, join='right', axis=1, fill_value=0)

    predicted_cluster = kmeans.predict(final_new_user_data)[0]

    all_users_in_cluster = df[df.cluster == predicted_cluster]

    return get_recommend_users(new_user, all_users_in_cluster, num_recommendations)
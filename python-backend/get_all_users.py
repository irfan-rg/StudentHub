from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "zStudentHub"
COLLECTION_NAME = "users"

def extract_user_summary(document: dict) -> dict:
    """
    Applies the specific transformation logic to a single user document.
    """
    if not document:
        return {}
    
    return {
        '_id': str(document.get('_id')),
        'educationLevel': document.get('educationLevel'),
        'skillsCanTeach': [
            skill.get('name') for skill in document.get('skillsCanTeach', []) 
        ],
        'points': document.get('points'),
        'badges': document.get('badges', []),
        'sessionsCompleted': document.get('sessionsCompleted'),
        'questionsAnswered': document.get('questionsAnswered'),
        'rating': document.get('rating'),
    }

def get_all_users():
    try:
        client = MongoClient(MONGO_URI)
        print(f"MongoDB Connected")

        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        
        cursor = collection.find({})

        summarized_users = []
        
        for document in cursor:
            summary = extract_user_summary(document)
            
            summarized_users.append(summary)

        client.close()

        return summarized_users
    
    except Exception as e:
        return f"Error: {e}"
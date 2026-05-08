import pymysql

# Connexion à la base de données
connection = pymysql.connect(
    host='127.0.0.1',
    port=3307,
    user='root',
    password='',
    database='idealab_db'
)

try:
    with connection.cursor() as cursor:
        # Supprimer la table votes_vote si elle existe
        cursor.execute("DROP TABLE IF EXISTS votes_vote;")
        print("✅ Table votes_vote supprimée avec succès")
        
        # Supprimer l'entrée de migration
        cursor.execute("DELETE FROM django_migrations WHERE app='votes' AND name='0001_initial';")
        print("✅ Entrée de migration supprimée")
        
    connection.commit()
    print("\n✅ Opération terminée avec succès !")
    print("Vous pouvez maintenant exécuter : python manage.py migrate")
    
finally:
    connection.close()

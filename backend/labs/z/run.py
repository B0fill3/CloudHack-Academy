from app import app

if __name__ == "__main__":
    # Inicia la app en 0.0.0.0 para que Docker la exponga
    app.run(host='0.0.0.0', port=5001, debug=True)

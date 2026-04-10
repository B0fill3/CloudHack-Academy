from flask import Flask, jsonify, Response

app = Flask(__name__)
@app.route('/')
def root():
    """
    Devuelve la lista de directorios en la raíz.
    """
    return Response("latest/", mimetype="text/plain")

@app.route('/latest/')
def latest():
    """
    Devuelve la lista de directorios en `latest`.
    """
    return Response("meta-data/", mimetype="text/plain")
# 🔹 Rutas de Metadatos de AWS (Solo IAM)
@app.route('/latest/meta-data/')
def metadata_root():
    """
    Devuelve la lista de directorios de meta-datos de AWS.
    Solo incluye IAM, ya que es lo único que necesitamos emular.
    """
    return Response("iam/", mimetype="text/plain")

@app.route('/latest/meta-data/iam/')
def metadata_iam():
    """
    Devuelve el contenido de la carpeta `iam/`.
    """
    return Response("security-credentials/", mimetype="text/plain")

@app.route('/latest/meta-data/iam/security-credentials/')
def metadata_iam_roles():
    """
    Devuelve el nombre del rol de IAM configurado.
    """
    return Response("Role_S3AccessToPrivateBucket", mimetype="text/plain")

@app.route('/latest/meta-data/iam/security-credentials/Role_S3AccessToPrivateBucket')
def metadata_iam_role_credentials():
    """
    Devuelve credenciales temporales falsas del IAM Role `S3AccessToPrivateBucket`.
    """
    fake_credentials = {
        "Code": "Success",
        "LastUpdated": "2025-03-06T12:00:00Z",
        "Type": "AWS-HMAC",
        "AccessKeyId": "ASIAXNGRVS62FKHM6MXV",
        "SecretAccessKey": "q0IsPqWIqmSk7i+Ya+xPebAQRDMSuwconQZ71aFA",
        "Token": "IQoJb3JpZ2luX2VjEHEaCWV1LXdlc3QtMyJHMEUCIFpwISL0JveZN4py8PmkWOq0uV/nyOM8PDVZX3OfW9VEAiEAlpwbzsa8OHsj/15LpPSike47sXsIW7DGg0Lv97ixqzYqxgUIuf//////////ARAAGgw1MDkzOTk2MjM2MDQiDPh3//ttyvgD5nJDyiqaBbQSvfmWPoBfH/rpoBVyqAMzp64kP6QOgId7OwOly8M2KwNpiJofjvvkbbmZ8Epp48gxL4s0MtVMA9/0B1EJY+ol/f6uj2LJTRzu+XsrGgWeMo0mmlqOz2nazAPf3GMCqqaRZTpXdpN6CvLInVYkqifCjjiAn09JSrzE+iA4iPZGWZrxiFbV39DMPQRsolmhd6a2R92U1Atk8UpQQCEvvoScWRtT/OrCS4h+BF/49Vu9cSzhpZ1iyq2AIBH0OrKTNN/bTOX99fHIcN4DUgMmqdn+MdaMkJhGX46RKb8CoSBCxGLRizrOVnPzbb70HCtqAb+9VEkM3IJ5yvKqKepUojLsDU0C9itVnv5EsVKZTsTreCZd6W7QqZ57PkacwU2QWWf7YHaJDvlFCakEHT4XeLzIt2bdotdsyXqJvmqs32TSxCjaofP5W+RMdcEVR8UVhOcCGmxfHUQ+91BLisQF4VmBtBAw2KBQSFkojgh5eA0Kj7GgcVwHZf9dRTUOI/fEcJgnRYBWH+YySB71nc2dtmUgUZ1IVk6TAmdQZj3VMTNnDfoEpx2cI30aITfRDs6C8Pg4I/QKHAXC9keeAIdZ/4S7sjCkSRApTVS9mgw4zlmunr5sLCJPUvwVkZHgah/LU7GRPiX7YWZALsrn6BmR/lRzJkxsSIxSetZEwgcxOejlJaSlehxNzGH/lSh0iY/E314pf3V63khWS4kvzyv8rILuJaKGgBFt5jtGWaP+f/lQZpZ99ciLtQ9YOK2LBGnFkbdc8M244guYontoxaIQs7v0q1oPl4vRrHhugOMl5Jk1enoERvJVkOqxb/FPpjnBrfdF6jGE1Afjo4fDi1eCI/xLqYtyJESevXBdl9hWTdnrlsyLD+nq3R2geTDhhcW+BjqxAYoJFfsuRob+pd6D6i2H8cSzbYJ7+cESjkeTXXhHqgCzWzG1X1rvWju/kKEvGc1KLUlWx9APdr5xHpP6CS/OlAql+7yGbJgPXwaiHM2qr2Aq57VPGUvvbRssxzvXkG60wXBnAastZ+40waoLYND+lbOGkNEDJr51wPMadP40oUahk2YVpfvztGpewAX8XLps7cS1gNXc6+oXmfrjD2Pu8zMcj2JASL9iAcU2GiE+9IFY/g==",
        "Expiration": "2035-03-06T18:00:00Z"
    }
    return jsonify(fake_credentials)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)  # Ejecutar en el puerto 5001

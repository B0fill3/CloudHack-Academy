from flask import Flask, request, Response

app = Flask(__name__)

# Token válido para acceso al bucket
VALID_TOKEN = "IQoJb3JpZ2luX2VjEHEaCWV1LXdlc3QtMyJHMEUCIFpwISL0JveZN4py8PmkWOq0uV/nyOM8PDVZX3OfW9VEAiEAlpwbzsa8OHsj/15LpPSike47sXsIW7DGg0Lv97ixqzYqxgUIuf//////////ARAAGgw1MDkzOTk2MjM2MDQiDPh3//ttyvgD5nJDyiqaBbQSvfmWPoBfH/rpoBVyqAMzp64kP6QOgId7OwOly8M2KwNpiJofjvvkbbmZ8Epp48gxL4s0MtVMA9/0B1EJY+ol/f6uj2LJTRzu+XsrGgWeMo0mmlqOz2nazAPf3GMCqqaRZTpXdpN6CvLInVYkqifCjjiAn09JSrzE+iA4iPZGWZrxiFbV39DMPQRsolmhd6a2R92U1Atk8UpQQCEvvoScWRtT/OrCS4h+BF/49Vu9cSzhpZ1iyq2AIBH0OrKTNN/bTOX99fHIcN4DUgMmqdn+MdaMkJhGX46RKb8CoSBCxGLRizrOVnPzbb70HCtqAb+9VEkM3IJ5yvKqKepUojLsDU0C9itVnv5EsVKZTsTreCZd6W7QqZ57PkacwU2QWWf7YHaJDvlFCakEHT4XeLzIt2bdotdsyXqJvmqs32TSxCjaofP5W+RMdcEVR8UVhOcCGmxfHUQ+91BLisQF4VmBtBAw2KBQSFkojgh5eA0Kj7GgcVwHZf9dRTUOI/fEcJgnRYBWH+YySB71nc2dtmUgUZ1IVk6TAmdQZj3VMTNnDfoEpx2cI30aITfRDs6C8Pg4I/QKHAXC9keeAIdZ/4S7sjCkSRApTVS9mgw4zlmunr5sLCJPUvwVkZHgah/LU7GRPiX7YWZALsrn6BmR/lRzJkxsSIxSetZEwgcxOejlJaSlehxNzGH/lSh0iY/E314pf3V63khWS4kvzyv8rILuJaKGgBFt5jtGWaP+f/lQZpZ99ciLtQ9YOK2LBGnFkbdc8M244guYontoxaIQs7v0q1oPl4vRrHhugOMl5Jk1enoERvJVkOqxb/FPpjnBrfdF6jGE1Afjo4fDi1eCI/xLqYtyJESevXBdl9hWTdnrlsyLD+nq3R2geTDhhcW+BjqxAYoJFfsuRob+pd6D6i2H8cSzbYJ7+cESjkeTXXhHqgCzWzG1X1rvWju/kKEvGc1KLUlWx9APdr5xHpP6CS/OlAql+7yGbJgPXwaiHM2qr2Aq57VPGUvvbRssxzvXkG60wXBnAastZ+40waoLYND+lbOGkNEDJr51wPMadP40oUahk2YVpfvztGpewAX8XLps7cS1gNXc6+oXmfrjD2Pu8zMcj2JASL9iAcU2GiE+9IFY/g=="

# Contenido simulado del archivo credentials.txt
CREDENTIALS_CONTENT = "admin:JveZN4py8PmkDMSuwconQ"

# Endpoint para listar buckets disponibles.
# Si la cabecera x-amz-security-token es válida, se lista el bucket "private-bucket".
@app.route("/", methods=["GET"])
def list_buckets():
    token = request.headers.get("x-amz-security-token")
    if token == VALID_TOKEN:
        # Se retorna la lista de buckets con el bucket "private-bucket"
        xml_response = """<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Buckets>
        <Bucket>
            <Name>private-bucket</Name>
            <CreationDate>2025-03-12T11:49:30.000Z</CreationDate>
        </Bucket>
    </Buckets>
</ListAllMyBucketsResult>"""
    else:
        # Si no se envía la cabecera o es incorrecta, se devuelve una lista vacía
        xml_response = """<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Buckets></Buckets>
</ListAllMyBucketsResult>"""
    return Response(xml_response, mimetype="application/xml")

# Endpoint para listar el contenido del bucket "private-bucket".
# Se comprueba la cabecera x-amz-security-token; de lo contrario se devuelve un error 403.
@app.route("/private-bucket", methods=["GET"])
def list_bucket_contents():
    token = request.headers.get("x-amz-security-token")
    if token != VALID_TOKEN:
        error_xml = """<?xml version="1.0" encoding="UTF-8"?>
<Error>
    <Code>AccessDenied</Code>
    <Message>Missing or invalid security token.</Message>
</Error>"""
        return Response(error_xml, status=403, mimetype="application/xml")
    
    xml_response = """<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>private-bucket</Name>
    <Contents>
        <Key>credentials.txt</Key>
        <LastModified>2025-03-12T11:49:30.000Z</LastModified>
        <Size>27</Size>
        <StorageClass>STANDARD</StorageClass>
    </Contents>
</ListBucketResult>"""
    return Response(xml_response, mimetype="application/xml")

# Endpoint para descargar el archivo credentials.txt del bucket "private-bucket".
# Se valida la cabecera de seguridad para permitir la descarga.
@app.route("/private-bucket/credentials.txt", methods=["GET","HEAD"])
def credentials():
    token = request.headers.get("x-amz-security-token")
    if token != VALID_TOKEN:
        error_xml = """<?xml version="1.0" encoding="UTF-8"?>
<Error>
    <Code>AccessDenied</Code>
    <Message>Missing or invalid security token.</Message>
</Error>"""
        return Response(error_xml, status=403, mimetype="application/xml")
    
    headers = {
        "Content-Type": "text/plain",
        "Content-Length": str(len(CREDENTIALS_CONTENT)),
        "Last-Modified": "Thu, 12 Mar 2025 11:49:30 GMT"  # Formato HTTP estándar
    }
    
    # Si es HEAD, no se envía body
    if request.method == "HEAD":
        return Response("", headers=headers)
    
    # Si es GET, se envía el contenido
    return Response(CREDENTIALS_CONTENT, headers=headers)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4566, debug=True)


from flask import Flask, request, Response, send_file
import mimetypes
from pathlib import Path

app = Flask(__name__)

BUCKET = "my-public-bucket"
BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "app" / "static" / "images"
CREDENTIALS_FILE = BASE_DIR / "app" / "static" / "credentials.txt"


def get_all_objects(prefix=""):
    """Devuelve lista de (key, Path) de todos los objetos del bucket."""
    objects = []

    if CREDENTIALS_FILE.exists() and "credentials.txt".startswith(prefix):
        objects.append(("credentials.txt", CREDENTIALS_FILE))

    if IMAGES_DIR.exists():
        for f in sorted(IMAGES_DIR.iterdir()):
            if f.is_file():
                key = f"images/{f.name}"
                if key.startswith(prefix):
                    objects.append((key, f))

    return objects


def build_contents_xml(objects):
    parts = []
    for key, path in objects:
        parts.append(f"""  <Contents>
    <Key>{key}</Key>
    <LastModified>2025-01-01T00:00:00.000Z</LastModified>
    <Size>{path.stat().st_size}</Size>
    <StorageClass>STANDARD</StorageClass>
  </Contents>""")
    return "\n".join(parts)


# ──────────────────────────────────────────────────────────────
# ListBuckets  →  GET /
# ──────────────────────────────────────────────────────────────
@app.route("/", methods=["GET", "HEAD"])
def list_buckets():
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Buckets>
    <Bucket>
      <Name>{BUCKET}</Name>
      <CreationDate>2025-01-01T00:00:00.000Z</CreationDate>
    </Bucket>
  </Buckets>
</ListAllMyBucketsResult>"""
    return Response(xml, mimetype="application/xml")


# ──────────────────────────────────────────────────────────────
# ListObjects(V2)  →  GET /my-public-bucket[?list-type=2&prefix=...]
# ──────────────────────────────────────────────────────────────
@app.route(f"/{BUCKET}", methods=["GET", "HEAD"])
def list_objects():
    prefix = request.args.get("prefix", "")
    list_type = request.args.get("list-type")

    objects = get_all_objects(prefix)
    contents = build_contents_xml(objects)

    if list_type == "2":
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Name>{BUCKET}</Name>
  <Prefix>{prefix}</Prefix>
  <KeyCount>{len(objects)}</KeyCount>
  <MaxKeys>1000</MaxKeys>
  <IsTruncated>false</IsTruncated>
{contents}
</ListBucketResult>"""
    else:
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Name>{BUCKET}</Name>
  <Prefix>{prefix}</Prefix>
  <MaxKeys>1000</MaxKeys>
  <IsTruncated>false</IsTruncated>
{contents}
</ListBucketResult>"""

    return Response(xml, mimetype="application/xml",
                    headers={"x-amz-bucket-region": "us-east-1"})


# ──────────────────────────────────────────────────────────────
# GetObject / HeadObject  →  GET /my-public-bucket/<key>
# ──────────────────────────────────────────────────────────────
@app.route(f"/{BUCKET}/<path:key>", methods=["GET", "HEAD"])
def get_object(key):
    if key.startswith("images/"):
        file_path = IMAGES_DIR / key[len("images/"):]
    elif key == "credentials.txt":
        file_path = CREDENTIALS_FILE
    else:
        file_path = None

    if file_path is None or not file_path.exists():
        error_xml = """<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
</Error>"""
        return Response(error_xml, status=404, mimetype="application/xml")

    mime = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"

    if request.method == "HEAD":
        return Response("", headers={
            "Content-Type": mime,
            "Content-Length": str(file_path.stat().st_size),
            "Last-Modified": "Wed, 01 Jan 2025 00:00:00 GMT",
        })

    return send_file(file_path, mimetype=mime)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4566)

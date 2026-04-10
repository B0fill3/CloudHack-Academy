from flask import Flask

app = Flask(__name__)

@app.route("/")
def loading():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deploying CloudHack Lab</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #6366f1;
          --secondary: #8b5cf6;
          --accent: #06b6d4;
          --success: #10b981;
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.8);
          --text-muted: rgba(255, 255, 255, 0.6);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(-45deg, #667eea, #764ba2, #6b73ff, #9644ff);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Floating particles */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 1s; }
        .particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 2s; }
        .particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 3s; }
        .particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 4s; }
        .particle:nth-child(6) { width: 6px; height: 6px; left: 60%; animation-delay: 5s; }
        .particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 6s; }
        .particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 7s; }
        .particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 8s; }

        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        /* Main container */
        .container {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
        }

        /* Glass card */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          margin: 0 auto;
        }

        /* Logo/Icon */
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, var(--accent), var(--primary));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
          animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Modern spinner */
        .spinner-container {
          margin: 2.5rem 0;
          position: relative;
        }

        .spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          position: relative;
        }

        .spinner::before,
        .spinner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
        }

        .spinner::before {
          width: 80px;
          height: 80px;
          background: conic-gradient(from 0deg, transparent, var(--primary), var(--secondary), var(--accent));
          animation: spin 2s linear infinite;
          border-radius: 50%;
        }

        .spinner::after {
          width: 60px;
          height: 60px;
          background: conic-gradient(from 180deg, transparent, var(--accent), var(--success));
          top: 10px;
          left: 10px;
          animation: spin 1.5s linear infinite reverse;
          border-radius: 50%;
        }

        /* Inner spinner core */
        .spinner-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background: linear-gradient(45deg, var(--primary), var(--secondary));
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Typography */
        .title {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .subtitle {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 400;
          line-height: 1.5;
        }

        .status {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 1.5rem;
        }

        /* Footer */
        .footer {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 400;
          z-index: 10;
        }

        .footer .brand {
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .glass-card {
            margin: 1rem;
            padding: 2rem 1.5rem;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .spinner {
            width: 60px;
            height: 60px;
          }

          .spinner::before {
            width: 60px;
            height: 60px;
          }

          .spinner::after {
            width: 40px;
            height: 40px;
            top: 10px;
            left: 10px;
          }

          .spinner-core {
            width: 20px;
            height: 20px;
          }
        }

        /* Smooth entrance animation */
        .container {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <!-- Floating particles -->
      <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>

      <div class="container">
        <div class="glass-card">
          
          <h1 class="title">Lanzando entorno de laboratorio</h1>
          <p class="subtitle">Desplegando servicios en AWS.<br>Esto puede tardar unos minutos.</p>
          
          <div class="spinner-container">
            <div class="spinner">
              <div class="spinner-core"></div>
            </div>
          </div>
          
          <div class="status">Inicializando recursos</div>
        </div>
      </div>

      <footer class="footer">
        <span class="brand">CloudHack Academy</span> · Master cloud hacking skills
      </footer>
        <script>
          setTimeout(function() {
            location.reload();
          }, 10000); // 10.000 milisegundos = 10 segundos
        </script>
    </body>
    </html>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

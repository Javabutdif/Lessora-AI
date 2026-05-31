import { useNavigate } from "react-router-dom";
import LessoraLogo from "../assets/Transparent Logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#fff",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "700px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <img
            src={LessoraLogo}
            alt="Lessora AI"
            style={{
              width: "280px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(59, 130, 246, 0.2))",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, transparent, #3b82f6)",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.2em",
                color: "#60a5fa",
                textTransform: "uppercase",
              }}
            >
              Less Planning, More Teaching
            </p>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, #7c3aed, transparent)",
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              margin: "0",
              lineHeight: "1.2",
              color: "#f3f4f6",
              letterSpacing: "-0.5px",
            }}
          >
            AI-Powered Lesson Planning for Educators
          </p>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.75)",
              margin: "0",
              lineHeight: "1.8",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              fontWeight: "400",
            }}
          >
            Create structured, professional lesson plans in minutes. Transform
            simple teacher inputs into organized activities, objectives, and
            assessments. Focus on what matters—engaging with your students.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1QVbg90SLPxsSMcxWAYHkger74yNziE8k/view?usp=drive_link",
                "_blank",
              )
            }
            style={{
              padding: "16px 44px",
              fontSize: "16px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                "0 12px 40px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              minWidth: "220px",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(-4px)";
              btn.style.boxShadow =
                "0 16px 48px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(0)";
              btn.style.boxShadow =
                "0 12px 40px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            📱 Download App
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "16px 44px",
              fontSize: "16px",
              fontWeight: "700",
              background: "rgba(59, 130, 246, 0.08)",
              color: "#60a5fa",
              border: "1.5px solid rgba(59, 130, 246, 0.5)",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              minWidth: "220px",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "rgba(59, 130, 246, 0.15)";
              btn.style.transform = "translateY(-4px)";
              btn.style.borderColor = "rgba(59, 130, 246, 0.8)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "rgba(59, 130, 246, 0.08)";
              btn.style.transform = "translateY(0)";
              btn.style.borderColor = "rgba(59, 130, 246, 0.5)";
            }}
          >
            Login
          </button>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Minutes Not Hours",
              desc: "Create plans instantly",
            },
            {
              icon: "🎯",
              title: "Structured Plans",
              desc: "Professional format",
            },
            { icon: "🤖", title: "AI-Powered", desc: "Smart generation" },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: "28px 24px",
                background: "rgba(59, 130, 246, 0.03)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(59, 130, 246, 0.08)";
                el.style.borderColor = "rgba(59, 130, 246, 0.3)";
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(59, 130, 246, 0.03)";
                el.style.borderColor = "rgba(59, 130, 246, 0.15)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "14px" }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  margin: "0 0 6px",
                  color: "#e5e7eb",
                  letterSpacing: "0.2px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.65)",
                  margin: "0",
                  fontWeight: "500",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginTop: "40px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              margin: "0",
              letterSpacing: "0.3px",
            }}
          >
            © 2026 Lessora AI. Empowering educators with AI.
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              margin: "0",
              fontWeight: "500",
              letterSpacing: "0.2px",
            }}
          >
            Developed by <span style={{ color: "#60a5fa" }}>Javabutdif</span>
          </p>
        </div>
      </div>
    </div>
  );
}

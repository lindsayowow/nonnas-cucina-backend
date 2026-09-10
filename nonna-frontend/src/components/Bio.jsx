import profilePic from "../assets/profilepic.jpg";
import "../styles/bio.css";

export default function Bio() {
  return (
    // use of semantic elements
    <section
      className="about-section card bio"
      aria-labelledby="bio-title"
    >
      <div className="bio-inner">

        <h2 id="bio-title" className="text-center">About the Developer</h2>

        <img
          src={profilePic}
          // alt text for image accessibility
          alt="Portrait of Lindsay Webb, long brown hair and glasses in a white suit"
          className="proPic"
          aria-hidden="true"
        />

        <p className="text-readable">
          Hi! I'm Lindsay, a software development student building tools that make
          ordering safer for families with complex dietary needs. Nonna's Cucina
          was inspired by the challenges families face when trying to order food
          safely, especially when dealing with allergies, dietary restrictions, or
          language barriers. This app combines visual selection with smart
          filtering to help everyone build safe, delicious meals.
        </p>

        <div className="bioButtons">
          <a
            href="https://github.com/lindsayowow"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/lindsay-webb/"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            LinkedIn
          </a>
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState, useCallback, useRef } from "react";

const SEAL_URL =
  "https://raw.githubusercontent.com/dotKevinWong/dayofgiving/refs/heads/main/assets/rchs_seal.png";
const DOG_GIF_URL =
  "https://raw.githubusercontent.com/dotKevinWong/dayofgiving/refs/heads/main/assets/dog_2026.gif";
const DOG_LINK = "https://www.romancatholichs.com/DayOfGiving";

interface Link {
  label: string;
  url: string;
}

export default function Home() {
  const [name, setName] = useState("John Smith");
  const [year, setYear] = useState("'26");
  const [title, setTitle] = useState("Title");
  const [phone, setPhone] = useState("215-627-1270 ext. 000");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState(
    "The Roman Catholic High School of Philadelphia"
  );
  const [address, setAddress] = useState(
    "301 N. Broad St., Philadelphia, PA 19107"
  );
  const [links, setLinks] = useState<Link[]>([
    { label: "Give Today", url: "https://www.romancatholichs.com/giving" },
    {
      label: "Tour our Campus",
      url: "https://tours.momentumvirtualtours.com/tours/myrYAonEb",
    },
  ]);
  const [copied, setCopied] = useState(false);
  const sigRef = useRef<HTMLDivElement>(null);

  const addLink = useCallback(() => {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }, []);

  const removeLink = useCallback((index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLink = useCallback(
    (index: number, field: "label" | "url", value: string) => {
      setLinks((prev) =>
        prev.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      );
    },
    []
  );

  const nameDisplay = year
    ? `${name || "Your Name"} ${year}`
    : name || "Your Name";
  const validLinks = links.filter((l) => l.label && l.url);

  const copySignature = useCallback(async () => {
    const sigContent = sigRef.current;
    if (!sigContent) return;

    const range = document.createRange();
    range.selectNodeContents(sigContent);
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(
        "Copy failed. Please manually select the signature and press Ctrl+C / Cmd+C (Mac)."
      );
    }

    selection.removeAllRanges();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>RCHS Email Signature Generator</h1>
        <p>The Roman Catholic High School of Philadelphia</p>
      </div>

      <div className="container">
        {/* Step 1: Customize */}
        <div className="card">
          <h2>
            <span className="step-num">1</span> Customize Your Signature
          </h2>
          <p style={{  fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            Fill in your information below. The preview updates automatically.
          </p>

          <div
            className="section-label first"
          >
            Your Info
          </div>

          <div className="field-row">
            <div>
              <div className="field-label">Full Name</div>
              <input
                className="field-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">Class Year (leave blank if N/A)</div>
              <input
                className="field-input"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div className="field-label">Title</div>
          <input
            className="field-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="field-row">
            <div>
              <div className="field-label">Phone</div>
              <input
                className="field-input"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">Email (optional)</div>
              <input
                className="field-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@romancatholichs.com"
              />
            </div>
          </div>

          <div className="section-label">Organization</div>

          <div className="field-label">Organization Name</div>
          <input
            className="field-input"
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />

          <div className="field-label">Address</div>
          <input
            className="field-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="section-label">Links</div>

          <div className="link-header">
            <span>Label</span>
            <span>URL</span>
            <span></span>
          </div>

          {links.map((link, i) => (
            <div key={i} className="link-item">
              <input
                className="field-input"
                type="text"
                value={link.label}
                placeholder="Label"
                onChange={(e) => updateLink(i, "label", e.target.value)}
              />
              <input
                className="field-input"
                type="text"
                value={link.url}
                placeholder="https://..."
                onChange={(e) => updateLink(i, "url", e.target.value)}
              />
              <button
                className="remove-link-btn"
                title="Remove"
                onClick={() => removeLink(i)}
              >
                &times;
              </button>
            </div>
          ))}

          <button className="add-link-btn" onClick={addLink}>
            + Add Link
          </button>
        </div>

        {/* Step 2: Preview & Copy */}
        <div className="card">
          <h2>
            <span className="step-num">2</span> Preview &amp; Copy Your
            Signature
          </h2>

          <div className="sig-preview">
            <div className="sig-preview-label">
              SELECT &amp; COPY EVERYTHING BELOW THIS LINE
            </div>
            <div ref={sigRef}>
              <SignaturePreview
                nameDisplay={nameDisplay}
                title={title}
                org={org}
                address={address}
                phone={phone}
                email={email}
                validLinks={validLinks}
              />
            </div>
          </div>

          <button
            className={`copy-btn${copied ? " copied" : ""}`}
            onClick={copySignature}
          >
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Signature
              </>
            )}
          </button>
        </div>

        {/* Step 3: Gmail Instructions */}
        <div className="card instructions">
          <h2>
            <span className="step-num">3</span> Add to Google Workspace (Gmail)
          </h2>
          <ol>
            <li>
              Open <strong>Gmail</strong> in your browser (mail.google.com)
            </li>
            <li>
              Click the <strong>gear icon</strong> in the top right, then click{" "}
              <strong>&quot;See all settings&quot;</strong>
            </li>
            <li>
              Scroll down to the <strong>&quot;Signature&quot;</strong> section
              on the General tab
            </li>
            <li>
              Click <strong>&quot;+ Create new&quot;</strong> and give it a name
              (e.g., &quot;RCHS Signature&quot;)
            </li>
            <li>
              <strong>Delete</strong> any existing content in the signature box
            </li>
            <li>
              <strong>Paste</strong> your copied signature (
              <code className="inline-code">Ctrl+V</code> /{" "}
              <code className="inline-code">Cmd+V</code>)
            </li>
            <li>
              Under <strong>&quot;Signature defaults&quot;</strong>, select your
              new signature for new emails and replies
            </li>
            <li>
              Scroll to the bottom and click{" "}
              <strong>&quot;Save Changes&quot;</strong>
            </li>
          </ol>
          <div className="note">
            <strong>About the logo:</strong> If the RCHS seal doesn&apos;t
            appear after pasting, click the <strong>image icon</strong> in the
            signature editor toolbar and upload the seal image. Ask your IT
            admin for the official high-res file.
          </div>
        </div>

        {/* Alternative: Outlook / Other */}
        <div className="card instructions">
          <h2>
            <span className="step-num">&#10038;</span> Alternative: Outlook /
            Other Email
          </h2>
          <ol>
            <li>
              <strong>Outlook Desktop:</strong> File &rarr; Options &rarr; Mail
              &rarr; Signatures &rarr; New &rarr; Paste
            </li>
            <li>
              <strong>Outlook Web:</strong> Settings &rarr; View all Outlook
              settings &rarr; Mail &rarr; Compose and reply &rarr; Paste
            </li>
            <li>
              <strong>Apple Mail:</strong> Mail &rarr; Settings &rarr;
              Signatures &rarr; Click + &rarr; Paste
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

/* ---- Signature Preview (inline styles for email compatibility) ---- */

function SignaturePreview({
  nameDisplay,
  title,
  org,
  address,
  phone,
  email,
  validLinks,
}: {
  nameDisplay: string;
  title: string;
  org: string;
  address: string;
  phone: string;
  email: string;
  validLinks: Link[];
}) {
  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      style={{
        fontFamily: "Arial,Helvetica,sans-serif",
        fontSize: "13px",
        color: "#333",
        lineHeight: "1.4",
        border: "none",
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              verticalAlign: "top",
              paddingRight: "14px",
              borderRight: "2px solid #4B2D7F",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SEAL_URL}
              alt="RCHS Seal"
              width="80"
              height="80"
              style={{ display: "block", borderRadius: "50%" }}
            />
          </td>
          <td style={{ verticalAlign: "top", paddingLeft: "14px" }}>
            <table cellPadding="0" cellSpacing="0" style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "0 0 2px 0",
                      fontFamily: "Arial,Helvetica,sans-serif",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#4B2D7F",
                    }}
                  >
                    {nameDisplay}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0 0 2px 0",
                      fontFamily: "Arial,Helvetica,sans-serif",
                      fontSize: "13px",
                      color: "#333",
                    }}
                  >
                    {title}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0 0 2px 0",
                      fontFamily: "Arial,Helvetica,sans-serif",
                      fontSize: "13px",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {org}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0 0 2px 0",
                      fontFamily: "Arial,Helvetica,sans-serif",
                      fontSize: "13px",
                      color: "#333",
                    }}
                  >
                    {address}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "0 0 2px 0",
                      fontFamily: "Arial,Helvetica,sans-serif",
                      fontSize: "13px",
                      color: "#333",
                    }}
                  >
                    {phone}
                  </td>
                </tr>
                {email && (
                  <tr>
                    <td
                      style={{
                        padding: "0 0 2px 0",
                        fontFamily: "Arial,Helvetica,sans-serif",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      <a
                        href={`mailto:${email}`}
                        style={{
                          color: "#4B2D7F",
                          textDecoration: "none",
                        }}
                      >
                        {email}
                      </a>
                    </td>
                  </tr>
                )}
                {validLinks.length > 0 && (
                  <tr>
                    <td
                      style={{
                        padding: "6px 0 0 0",
                        fontFamily: "Arial,Helvetica,sans-serif",
                        fontSize: "12px",
                      }}
                    >
                      {validLinks.map((link, i) => (
                        <span key={i}>
                          {i > 0 && (
                            <span
                              style={{
                                color: "#999",
                                margin: "0 6px",
                              }}
                            >
                              |
                            </span>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#4B2D7F",
                              textDecoration: "none",
                              fontWeight: "bold",
                            }}
                          >
                            {link.label}
                          </a>
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td colSpan={2} style={{ paddingTop: "14px" }}>
            <table
              cellPadding="0"
              cellSpacing="0"
              style={{
                fontFamily: "Arial,Helvetica,sans-serif",
                border: "none",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      verticalAlign: "middle",
                      paddingRight: "12px",
                    }}
                  >
                    <a href={DOG_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={DOG_GIF_URL}
                        alt="RCHS Day of Giving"
                        width="100"
                        height="77"
                        style={{ display: "block" }}
                      />
                    </a>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <a
                      href={DOG_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "#4B2D7F",
                        fontWeight: "bold",
                        fontSize: "13px",
                        fontFamily: "Arial,Helvetica,sans-serif",
                      }}
                    >
                      10th Annual Day of Giving
                    </a>
                    <br />
                    <span
                      style={{
                        fontFamily: "Arial,Helvetica,sans-serif",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      Tuesday • May 12, 2026
                    </span>
                    <br />
                    <a
                      href={DOG_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "Arial,Helvetica,sans-serif",
                        fontSize: "11px",
                        color: "#4B2D7F",
                        textDecoration: "underline",
                      }}
                    >
                      RomanCatholicHS.com/DayOfGiving
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

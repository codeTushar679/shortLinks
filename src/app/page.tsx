"use client";

import { useState } from "react";
import { nanoid } from "nanoid";

export default function Home() {
  const [originalLink, setOriginalLink] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [miniLink, setMiniLink] = useState("");
  const [copyLink, setCopyLink] = useState(false);

  function generateShortLink(): void {
    if (!originalLink) {
      alert("Please provide a Link to shorten.");
      return;
    }

    const requestBody = {
      orgLink: originalLink,
      shortLink: customLink || nanoid(5), // Use customLink if provided, otherwise unique IDs
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    fetch("/api/shorten", options)
      .then((response: Response) => response.json())
      .then((response) => {
        if (!response.success) {
          alert(response.message); // Show alert if the short link already exists
          return;
        }
        console.log("Shortened Link:", response);
        if (response.shortLink) {
          const newMiniLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${response.shortLink}`;
          setMiniLink(newMiniLink);
        } else {
          console.error("Error: shortLink is undefined in the response");
        }
      })
      .catch((err) => console.error("Error:", err));
  }

  function copyToClipboard(): void {
    navigator.clipboard.writeText(miniLink);
    setCopyLink(true);
    setTimeout(() => setCopyLink(false), 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center h-100 w-110 bg-[#FFB433] rounded-lg drop-shadow-lg">
      <h1 className="font-bold text-4xl text-[#854836] mb-6">
        Free Link Shortener
      </h1>
      <div className="flex flex-col items-center gap-4">
        <input
          value={originalLink}
          onChange={(e) => setOriginalLink(e.target.value)}
          type="text"
          placeholder="Paste your link...."
          className="outline-[#B17457]  p-1 rounded-sm w-80 hover:h-10 hover:w-85 bg-white drop-shadow-sm"
        />
        <input
          value={customLink}
          onChange={(e) => setCustomLink(e.target.value)}
          type="text"
          placeholder="Customize (optional)"
          className="outline-[#B17457] p-1 rounded-sm w-80 hover:h-10 hover:w-85 bg-white drop-shadow-sm"
        />
        <button
          onClick={generateShortLink}
          className="bg-[#399918] p-1 rounded-lg ml-2 h-9 shadow-2xs text-[#FEFAE0] drop-shadow-sm"
        >
          Generate Short Link
        </button>
      </div>

      {miniLink && (
        <div className="mt-5">
          <h1 className="font-bold text-[#00712D] mt-5">Your Short Link:</h1>
          <div>
            <input
              value={miniLink}
              readOnly
              type="text"
              placeholder="Short Link"
              className=" outline-none p-1 rounded-sm w-65 bg-white drop-shadow-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-[#399918] p-1 rounded-lg ml-2 h-9 shadow-2xs text-[#FEFAE0] drop-shadow-sm"
            >
              {copyLink ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

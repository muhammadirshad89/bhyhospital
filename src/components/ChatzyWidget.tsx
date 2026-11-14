import Script from "next/script";

/**
 * Chatzy AI chatbot widget (official embed code from Chatzy, unchanged: same URLs, id and class).
 *
 * Why the class matters: the widget script finds its own <script> tag with
 * `document.querySelector(".chatzy_widget_script")` and reads that tag's `id` as the chatbot id.
 * If the class is missing it finds no id and silently does nothing. Do not rename the class or the id.
 *
 * Mounted once, in the root layout, so it is loaded once per page load and survives client-side navigation.
 * `next/script` de-duplicates by `id`, and the widget also guards itself with window.__CHATZY_WIDGET_LOADED__.
 * The widget draws itself (icon, chat window) inside its own shadow DOM appended to <body>, so it does not
 * inherit or change the site's styling.
 */
const CHATZY_CSS_URL = "https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb";
const CHATZY_SCRIPT_URL = "https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c";
const CHATZY_SCRIPT_ID = "e3cd3465-60b6-4a73-b34d-b0adc957934e";

export function ChatzyWidget() {
  return (
    <>
      <link rel="stylesheet" href={CHATZY_CSS_URL} />
      <Script src={CHATZY_SCRIPT_URL} id={CHATZY_SCRIPT_ID} className="chatzy_widget_script" strategy="afterInteractive" defer />
    </>
  );
}

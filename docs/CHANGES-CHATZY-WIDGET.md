# Chatzy chatbot widget

Root cause of "not appearing": the Chatzy script looks for its own tag with `document.querySelector(".chatzy_widget_script")` and uses that tag's `id` as the chatbot id. The `<Script>` added earlier had the `id` but not `className="chatzy_widget_script"`, so the script found no id and silently did nothing (no error, nothing drawn).

Fix: `src/components/ChatzyWidget.tsx` renders the official stylesheet `<link>` and a `next/script` `<Script>` with the official URL, id and the `chatzy_widget_script` class. It is mounted once at the end of `<body>` in `src/app/layout.tsx`. If your `globals.css` still has the Chatzy `@import` line, delete it (the component loads the stylesheet; keeping both only downloads it twice).

Not changed: `Permissions-Policy: microphone=()` in `next.config.mjs`. The widget's iframe asks for microphone access (`allow="microphone *"`), which this header blocks. Text chat is not affected; relax the header (for example `microphone=(self "https://app.chatzy.ai")`) only if the bot offers voice input.

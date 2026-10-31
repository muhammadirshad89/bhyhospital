import { showPlaceholderContent } from "@/lib/env";

export function PreviewBanner() {
  if (!showPlaceholderContent()) return null;
  return (
    <div className="preview-banner" role="note">
      <div className="container">
        Pre-launch preview: items marked <strong>To be confirmed</strong> or <strong>Placeholder</strong> will be replaced with verified
        hospital information. Search engines are blocked until launch.
      </div>
    </div>
  );
}

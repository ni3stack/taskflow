import { Button } from "@ui-lab/ui";

function OAuthButtons() {
  return(
    <div className="oauth-options">
      <Button type="button" variant="secondary">Google</Button>
      <Button type="button"  variant="secondary">GitHub</Button>
    </div>
  );
}


export default OAuthButtons;
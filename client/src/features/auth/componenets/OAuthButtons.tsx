import { Button } from "@ni3stack/ui";

function OAuthButtons() {
  return(
    <div className="oauth-options">
      <Button type="button" variant="secondary">Google</Button>
      <Button type="button"  variant="secondary">GitHub</Button>
    </div>
  );
}


export default OAuthButtons;
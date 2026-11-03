import { 
  Banner, 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@ni3stack/ui";
import { 
  ArrowRight, 
  Check, 
  MessageCircle,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Link } from "react-router-dom"

import "./PricingPage.css";

export default function PricingPage() {
  return (
    <div className="pricing-page">
      <div className="pricing-page__container">
        <header className="pricing-page__intro">
          <p className="pricing-page__eyebrow">Pricing</p>
          <h1 className="pricing-page__title">
            Start with your tasks. Grow with your team.
          </h1>
          <p className="pricing-page__description">
            Organize your personal tasks for free. Bring projects and people
            together with a paid workspace.
          </p>
        </header>
        <div className="pricing-page__content">
          <Card className="pricing-page__card">
            <CardHeader className="pricing-page__card-header">
              <UserRound size="16px" aria-hidden="true" />
              <span>For your personal tasks</span>
            </CardHeader>
            <CardContent className="pricing-page__card-content">
              <div>
                <p className="pricing-page__plan-title">Personal</p>
                <p className="pricing-page__plan-description">A focused place to organize your own tasks and deadlines.</p>
              </div>
              <div>
                <h1 className="pricing-page__price-title">Free</h1>
                <p className="pricing-page__price-description">Personal task management, at no cost.</p>
              </div>
              <ul className="pricing-page__features">
                <li>
                  <Check size={16} />
                  <span>Free personal task management</span>
                </li>
                <li>
                  <Check size={16} />
                  <span>Tasks & deadlines</span>
                </li>
                <li>
                  <Check size={16} />
                  <span>Priorities & status</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pricing-page__card-footer">
              <Link to="/signup" className="action action--secondary">
                <span>Get Started for free</span>
                <ArrowRight size={16} aria-hidden="true"></ArrowRight>
              </Link>
            </CardFooter>
          </Card>
          <Card className="pricing-page__card">
            <CardHeader className="pricing-page__card-header pricing-page__card-header--workspace">
              <UsersRound size="16px" aria-hidden="true" />
              <span>For Projects & People </span>
            </CardHeader>
            <CardContent className="pricing-page__card-content">
              <div>
                <p className="pricing-page__plan-title">Paid workspace</p>
                <p className="pricing-page__plan-description">Bring projects and people together in a paid workspace.</p>
              </div>
              <div>
                <h1 className="pricing-page__price-title">To be confirmed</h1>
                <p className="pricing-page__price-description">Contact us to discuss workspace pricing.</p>
              </div>
              <ul className="pricing-page__features">
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>Projects in a shared workspace</span>
                </li>
                <li>
                  <Check size={16} />
                  <span>Bring people together</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pricing-page__card-footer">
              <Link to="/signup" className="action action--primary">
                <span>Contact Us</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </CardFooter>
          </Card>
        </div>
        <Banner variant="info" className="pricing-page__banner">
          <MessageCircle 
            size={24}
            className="pricing-page__banner-icon"
            aria-hidden="true"
          />
          <div className="pricing-page__banner-copy">
            <h2 className="pricing-page__banner-title">Planning to bring people together?</h2>
            <p className="pricing-page__banner-description">Contact us about a paid workspace. Pricing is to be confirmed..</p>
          </div>
          <Link to="/contactus" className="action action--secondary">
            <span>Contact us</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Banner>
      </div>
    </div>
  );
}
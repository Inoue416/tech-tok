# Requirements Document

## Introduction

This document defines the requirements for the unauthenticated home page experience. The feature provides a preview of the TechTok feed to unauthenticated users, allowing them to view up to 3 articles before being prompted to log in. Authenticated users are automatically redirected to the full feed experience.

## Glossary

- **Home_Page**: The landing page at the root path ("/") of the application
- **Feed_Preview**: A limited view of the feed showing only the first 3 articles
- **Login_Prompt**: A UI component that encourages users to sign in to access more content
- **Authenticated_User**: A user who has successfully logged in via OAuth (Google or GitHub)
- **Unauthenticated_User**: A visitor who has not logged in
- **Feed_Page**: The full feed experience located at "/feed" path

## Requirements

### Requirement 1

**User Story:** As an unauthenticated user, I want to preview articles on the home page, so that I can evaluate the content before deciding to sign up

#### Acceptance Criteria

1. WHEN an unauthenticated user visits the Home_Page, THE Home_Page SHALL display the first 3 articles from the feed
2. WHEN an unauthenticated user scrolls to the 4th article position, THE Home_Page SHALL display the Login_Prompt instead of an article
3. THE Home_Page SHALL prevent scrolling beyond the Login_Prompt for unauthenticated users
4. THE Home_Page SHALL use the same vertical scrolling UI pattern as the Feed_Page
5. THE Home_Page SHALL display a persistent login encouragement UI similar to the current unauthenticated home page design

### Requirement 2

**User Story:** As an authenticated user, I want to be automatically redirected to the full feed, so that I can access all content without unnecessary navigation

#### Acceptance Criteria

1. WHEN an authenticated user visits the Home_Page, THE Home_Page SHALL redirect the user to the Feed_Page
2. THE Home_Page SHALL complete the redirect before rendering any content to the Authenticated_User
3. THE Home_Page SHALL preserve any query parameters during the redirect

### Requirement 3

**User Story:** As an unauthenticated user, I want to see clear login prompts, so that I understand how to access more content

#### Acceptance Criteria

1. THE Login_Prompt SHALL display a clear call-to-action message encouraging sign-in
2. THE Login_Prompt SHALL provide buttons for Google OAuth authentication
3. THE Login_Prompt SHALL provide buttons for GitHub OAuth authentication
4. THE Login_Prompt SHALL explain the benefits of signing in (e.g., "Sign in to view unlimited articles")
5. THE Login_Prompt SHALL be visually distinct from article content

### Requirement 4

**User Story:** As a product owner, I want the preview experience to be performant, so that unauthenticated users have a positive first impression

#### Acceptance Criteria

1. THE Home_Page SHALL load and display the first article within 2 seconds on a standard connection
2. THE Home_Page SHALL prefetch only the first 3 articles for unauthenticated users
3. THE Home_Page SHALL use server-side rendering for initial page load
4. THE Home_Page SHALL implement proper loading states during data fetching

### Requirement 5

**User Story:** As an unauthenticated user, I want the preview to be responsive, so that I can evaluate the app on any device

#### Acceptance Criteria

1. THE Home_Page SHALL display correctly on mobile devices (320px width and above)
2. THE Home_Page SHALL display correctly on tablet devices (768px width and above)
3. THE Home_Page SHALL display correctly on desktop devices (1024px width and above)
4. THE Login_Prompt SHALL adapt its layout based on screen size

# Requirements Document

## Introduction

The Petition Report PDF Generation feature enables petition creators to generate official, verifiable PDF reports of their petitions to present to addressees (government officials, organizations, or individuals). The feature includes tier-based access control, download tracking, payment integration for additional downloads, and QR code verification to prevent forgery.

This is a premium feature designed to drive revenue and encourage tier upgrades while providing genuine value to petition creators who need credible, professional documentation of their campaigns.

## Glossary

- **System**: The 3arida.ma petition platform
- **Report**: A professionally formatted PDF document containing petition data, statistics, and verification information
- **Creator**: The user who created the petition
- **Addressee**: The target recipient of the petition (government official, organization, or individual)
- **Verification_Page**: A web page that confirms the authenticity of a generated report
- **QR_Code**: A scannable code linking to the verification page
- **Download_Count**: The number of times a creator has downloaded a report for a specific petition
- **Free_Download**: A report download that does not require payment
- **Paid_Download**: A report download that requires payment of 19 MAD
- **Beta_Mode**: The period during which the BETA100 coupon is automatically applied
- **Tier**: The pricing tier of a petition (Free, Starter, Pro, Advanced, Enterprise)
- **Reference_Code**: A unique identifier for each petition

## Requirements

### Requirement 1: Report Generation

**User Story:** As a petition creator, I want to generate an official PDF report of my petition, so that I can present credible, verifiable evidence to the addressee.

#### Acceptance Criteria

1. WHEN a creator requests report generation, THE System SHALL generate a PDF containing petition title, description, statistics, and verification information
2. WHEN generating a report, THE System SHALL include a QR code linking to the verification page
3. WHEN generating a report, THE System SHALL use Arabic RTL layout with Cairo font
4. WHEN generating a report, THE System SHALL create a 5-page document with cover, details, content, statistics, and verification sections
5. WHEN generating a report, THE System SHALL include the petition reference code on the cover page
6. WHEN generating a report, THE System SHALL include generation date and time
7. WHEN generating a report, THE System SHALL include the download number (1st, 2nd, 3rd, etc.)

### Requirement 2: Tier-Based Access Control

**User Story:** As a platform administrator, I want to control report access based on pricing tiers, so that we can monetize this premium feature appropriately.

#### Acceptance Criteria

1. WHILE Beta_Mode is active, THE System SHALL allow all tiers to generate reports without restrictions
2. WHILE Beta_Mode is active, THE System SHALL provide unlimited free downloads for all tiers
3. WHEN Beta_Mode is inactive AND a petition has Free tier, THE System SHALL prevent report generation and display an upgrade prompt
4. WHEN Beta_Mode is inactive AND a petition has a paid tier, THE System SHALL allow report generation
5. WHEN checking tier access, THE System SHALL verify the petition's pricing tier from the database

### Requirement 3: Download Tracking

**User Story:** As a platform administrator, I want to track report downloads, so that we can enforce download limits and payment requirements.

#### Acceptance Criteria

1. WHEN a report is downloaded, THE System SHALL increment the download count for that petition
2. WHEN a report is downloaded, THE System SHALL record the download timestamp, user ID, download number, and IP address
3. WHEN a report is downloaded with payment, THE System SHALL record the payment ID in the download history
4. WHEN displaying download information, THE System SHALL show the total download count and remaining free downloads
5. THE System SHALL persist download history in the petition document

### Requirement 4: Free Download Allocation

**User Story:** As a petition creator with a paid tier, I want to receive 2 free report downloads, so that I can generate reports without immediate payment.

#### Acceptance Criteria

1. WHEN Beta_Mode is inactive AND a petition has a paid tier, THE System SHALL provide 2 free downloads
2. WHEN a creator requests a download AND free downloads remain, THE System SHALL generate the report without payment
3. WHEN a creator requests a download AND no free downloads remain, THE System SHALL require payment
4. WHEN displaying the download button, THE System SHALL show the number of remaining free downloads
5. THE System SHALL calculate remaining free downloads as (2 - download_count) for paid tiers

### Requirement 5: Payment Integration

**User Story:** As a petition creator, I want to purchase additional report downloads for 19 MAD, so that I can generate reports beyond my free allocation.

#### Acceptance Criteria

1. WHEN a creator requests a download beyond free allocation, THE System SHALL display a payment modal with 19 MAD price
2. WHEN a creator selects Stripe payment, THE System SHALL create a Stripe payment intent for 19 MAD
3. WHEN a creator selects PayPal payment, THE System SHALL create a PayPal order for 19 MAD
4. WHEN payment is successful, THE System SHALL generate and deliver the report
5. WHEN payment fails, THE System SHALL display an error message and not generate the report
6. WHEN payment is completed, THE System SHALL send a confirmation email to the creator

### Requirement 6: Report Verification

**User Story:** As an addressee, I want to verify the authenticity of a petition report, so that I can confirm it has not been forged.

#### Acceptance Criteria

1. WHEN a user scans the QR code on a report, THE System SHALL redirect to the verification page
2. WHEN a user visits the verification page, THE System SHALL display the petition title, reference code, and current statistics
3. WHEN a user visits the verification page, THE System SHALL display the total download count and last download date
4. WHEN a user visits the verification page for an invalid petition ID, THE System SHALL display an error message
5. THE System SHALL generate QR codes linking to https://3arida.ma/reports/verify/{petitionId}

### Requirement 7: Report Content Structure

**User Story:** As a petition creator, I want the report to include comprehensive petition information, so that the addressee has all necessary context.

#### Acceptance Criteria

1. THE Report SHALL include a cover page with logo, title, reference code, generation date, and QR code
2. THE Report SHALL include a details page with petition type, category, addressee, publisher information, and tier information
3. THE Report SHALL include a content page with the full petition description
4. THE Report SHALL include a statistics page with signature count, target, progress percentage, comments, views, and shares
5. THE Report SHALL include a verification page with generation information, platform details, and legal notice

### Requirement 8: UI Integration

**User Story:** As a petition creator, I want to access report generation from my dashboard, so that I can easily download reports for my petitions.

#### Acceptance Criteria

1. WHEN viewing the petition management section, THE System SHALL display a "Download Report" button for each petition
2. WHEN Beta_Mode is inactive AND the petition has Free tier, THE System SHALL display the button with a lock icon and disabled state
3. WHEN Beta_Mode is inactive AND free downloads remain, THE System SHALL display the button with a "Free" badge and remaining count
4. WHEN Beta_Mode is inactive AND payment is required, THE System SHALL display the button with a "19 MAD" badge
5. WHEN Beta_Mode is active, THE System SHALL display the button with a "Free - Beta" badge
6. WHEN a creator clicks the button on Free tier post-beta, THE System SHALL display an upgrade modal
7. WHEN a creator clicks the button with free downloads available, THE System SHALL generate and download the report immediately
8. WHEN a creator clicks the button requiring payment, THE System SHALL display the payment modal

### Requirement 9: Data Persistence

**User Story:** As a platform administrator, I want to store report download data in the database, so that we can track usage and enforce limits.

#### Acceptance Criteria

1. THE System SHALL add a reportDownloads field to the Petition schema storing the download count
2. THE System SHALL add a reportDownloadHistory field to the Petition schema storing an array of download records
3. WHEN a download occurs, THE System SHALL update both reportDownloads and reportDownloadHistory atomically
4. THE System SHALL store downloadedAt, downloadedBy, downloadNumber, paymentId, and ipAddress in each history record
5. THE System SHALL ensure download data persists across sessions

### Requirement 10: PDF Generation Technical Requirements

**User Story:** As a developer, I want to use a reliable PDF generation library, so that reports are consistently formatted and support Arabic text.

#### Acceptance Criteria

1. THE System SHALL use the jsPDF library for PDF generation
2. WHEN generating PDFs, THE System SHALL support Arabic RTL text layout
3. WHEN generating PDFs, THE System SHALL use the Cairo font for Arabic text
4. WHEN generating PDFs, THE System SHALL support multi-page documents
5. WHEN generating PDFs, THE System SHALL embed QR code images
6. WHEN generating PDFs, THE System SHALL generate files with naming format: petition-report-{referenceCode}-{date}.pdf

### Requirement 11: Error Handling

**User Story:** As a petition creator, I want clear error messages when report generation fails, so that I understand what went wrong and how to resolve it.

#### Acceptance Criteria

1. WHEN report generation fails due to missing data, THE System SHALL display an error message indicating the missing information
2. WHEN payment processing fails, THE System SHALL display an error message with the failure reason
3. WHEN network errors occur during generation, THE System SHALL display a retry option
4. WHEN the petition is not found, THE System SHALL display an error message
5. WHEN the user lacks permission to generate a report, THE System SHALL display an authorization error

### Requirement 12: Localization

**User Story:** As a user, I want the report interface in my preferred language, so that I can understand all options and messages.

#### Acceptance Criteria

1. THE System SHALL provide Arabic translations for all report-related UI text
2. THE System SHALL provide French translations for all report-related UI text
3. THE System SHALL provide English translations for all report-related UI text
4. WHEN displaying the report button, THE System SHALL use the user's selected language
5. WHEN displaying the payment modal, THE System SHALL use the user's selected language
6. WHEN displaying the verification page, THE System SHALL use the user's selected language

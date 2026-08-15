import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Link as RouterLink } from "react-router-dom";
import PublicFooterLinks from "../components/PublicFooterLinks";
import { BrandMark } from "../layout/AppLayout";

const SITE_URL = "https://analyzeytcomments.com";
const SUPPORT_EMAIL = "analyzeytcomments@gmail.com";

const ExternalLink = ({ href, children }) => (
  <MuiLink href={href} target="_blank" rel="noreferrer">{children}</MuiLink>
);

const pages = {
  about: {
    eyebrow: "About CommentScope",
    title: "Clearer audience feedback for every creator",
    description: "Learn how CommentScope turns public YouTube comments into organized sentiment, themes, keywords, and content suggestions.",
    intro: "CommentScope is an independent audience analytics tool built to help creators and teams understand large comment sections without reading every message manually.",
    sections: [
      {
        heading: "What CommentScope does",
        paragraphs: [
          "Paste a public YouTube video link and CommentScope organizes the available comments into sentiment summaries, recurring themes, keywords, multilingual feedback, and audience suggestions.",
          "CommentScope-generated analysis is our own product output. It is not produced, approved, or endorsed by YouTube.",
        ],
      },
      {
        heading: "Who it is for",
        bullets: [
          "Creators deciding what to publish next",
          "Community managers reviewing viewer feedback",
          "Researchers exploring public comment discussions",
          "Teams that need a faster overview of multilingual responses",
        ],
      },
      {
        heading: "Our approach",
        paragraphs: [
          "We aim to keep the core analyzer simple and free while building sensible protections against abuse. Automated sentiment and theme detection can make mistakes, so important decisions should include human review of the underlying comments.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy Policy",
    title: "How CommentScope handles information",
    description: "CommentScope Privacy Policy describing account data, public YouTube comment analysis, storage, sharing, and user choices.",
    intro: "Effective August 15, 2026. This policy explains the information CommentScope collects, why it is used, and the choices available to you.",
    sections: [
      {
        heading: "Information we collect",
        bullets: [
          "Account information: first name, last name, email address, account creation time, and a securely hashed password for password accounts.",
          "Google Sign-In information: the name, email address, and verified account identity Google shares after you choose to continue. CommentScope does not receive your Google password.",
          "Analysis information: submitted public YouTube video URLs or IDs, video titles, available public comments and replies, generated analysis results, job status, and analysis history.",
          "Security and device information: essential browser storage for your session and basic server, Cloudflare, and security logs that may include IP address, browser type, timestamps, and request details.",
          "Password recovery information: a one-way hash of a short-lived reset token, its expiration, and whether it was used.",
        ],
      },
      {
        heading: "YouTube and Google services",
        paragraphs: [
          <span key="youtube-api">CommentScope uses YouTube API Services to retrieve data available for public videos. Your use of CommentScope is also subject to the <ExternalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</ExternalLink>. Google describes its own information practices in the <ExternalLink href="https://policies.google.com/privacy">Google Privacy Policy</ExternalLink>.</span>,
          "CommentScope currently uses a server-side API key for public YouTube data. Google Sign-In authenticates your CommentScope account but does not grant CommentScope access to your private YouTube account, channel, subscriptions, watch history, or private videos.",
          <span key="google-access">You can review or revoke third-party Google account access from <ExternalLink href="https://security.google.com/settings/security/permissions">Google Security Settings</ExternalLink>. Revoking Google Sign-In access does not automatically delete your CommentScope account or saved reports; contact us to request account-data deletion.</span>,
        ],
      },
      {
        heading: "How we use information",
        bullets: [
          "Create and secure your account and restore your signed-in session",
          "Retrieve public video comments and generate the reports you request",
          "Save and display your analysis history",
          "Send requested password-reset messages",
          "Diagnose failures, prevent abuse, protect quota, and improve reliability",
          "Respond to support, privacy, and deletion requests",
        ],
      },
      {
        heading: "Storage and retention",
        paragraphs: [
          "The browser stores your CommentScope access token and basic profile details in local storage so your session can be restored. Signing out removes that local session information.",
          "Account information is retained while the account is active or while reasonably necessary for security, legal, and operational purposes. You can delete individual completed analyses from History. YouTube API data is retained only as needed to provide saved reports and is subject to YouTube data refresh and deletion requirements.",
          "Password-reset tokens expire after a short period and are stored only as one-way hashes. Backups and security logs may remain for a limited period after primary data is removed.",
        ],
      },
      {
        heading: "Service providers and sharing",
        paragraphs: [
          "CommentScope uses service providers only to operate the application, including Cloudflare for DNS, security, and secure tunneling; Google for YouTube API Services and Google Sign-In; and Resend for password-reset email. These providers process information under their own terms and privacy policies.",
          "We do not sell your personal information. We may disclose information when required by law, to protect users or the service, or as part of a business transfer with appropriate safeguards.",
        ],
      },
      {
        heading: "Your choices",
        bullets: [
          "Delete individual analysis reports from your History page.",
          `Email ${SUPPORT_EMAIL} to request access, correction, or deletion of your CommentScope account information.`,
          "Sign out to remove your CommentScope session from the current browser.",
          "Use Google Security Settings to review or revoke Google account access.",
        ],
      },
      {
        heading: "Security, children, and changes",
        paragraphs: [
          "We use safeguards such as password hashing, signed sessions, access controls, and encrypted HTTPS transport. No online service can guarantee absolute security.",
          "CommentScope is not directed to children under 13. If you believe a child provided personal information, contact us so it can be reviewed and removed.",
          "We may update this policy as the service changes. Material changes will be reflected by a new effective date and, when appropriate, a new request for consent.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms of Use",
    title: "Rules for using CommentScope",
    description: "CommentScope Terms of Use covering accounts, acceptable use, YouTube services, analysis limitations, and service availability.",
    intro: "Effective August 15, 2026. By creating an account, signing in, or using CommentScope, you agree to these Terms of Use and the Privacy Policy.",
    sections: [
      {
        heading: "CommentScope and YouTube",
        paragraphs: [
          <span key="youtube-terms">CommentScope uses YouTube API Services. By using CommentScope, you also agree to be bound by the <ExternalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</ExternalLink>. CommentScope is independent and is not affiliated with, sponsored by, or endorsed by YouTube or Google.</span>,
          "YouTube video titles, comments, and other YouTube-originated data remain subject to the rights and rules of their respective owners and YouTube. CommentScope-generated sentiment, themes, summaries, and suggestions are our independent automated analysis and are not YouTube metrics.",
        ],
      },
      {
        heading: "Eligibility and accounts",
        bullets: [
          "You must be at least 13 years old and legally able to accept these terms.",
          "Provide accurate account information and keep your credentials secure.",
          "You are responsible for activity performed through your account.",
          "Notify us promptly if you believe your account has been compromised.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: ["Use CommentScope only for lawful analysis of public YouTube videos."],
        bullets: [
          "Do not attempt to access private, deleted, restricted, or unauthorized content.",
          "Do not harass, profile, surveil, or try to identify commenters using analysis results.",
          "Do not overload the service, evade quotas, automate abusive requests, or interfere with security.",
          "Do not copy, resell, or redistribute YouTube data in violation of YouTube's terms.",
          "Do not use results to make unlawful, discriminatory, deceptive, or harmful decisions.",
        ],
      },
      {
        heading: "Automated analysis limitations",
        paragraphs: [
          "Sentiment, language detection, themes, summaries, and suggestions are generated automatically and may be incomplete, outdated, or incorrect. Sarcasm, context, mixed languages, slang, and limited comment samples can affect results.",
          "CommentScope does not provide legal, financial, medical, employment, advertising-suitability, or professional advice. Review original comments and use independent judgment before making important decisions.",
        ],
      },
      {
        heading: "Availability and limits",
        paragraphs: [
          "The service is currently offered without a guaranteed service level. Features, quotas, free access, or availability may change to protect users, YouTube API quota, security, and system reliability.",
          "We may suspend or terminate access for abuse, security risks, legal requirements, or violations of these terms.",
        ],
      },
      {
        heading: "Disclaimers and liability",
        paragraphs: [
          "CommentScope is provided on an “as is” and “as available” basis to the extent permitted by law. We do not guarantee uninterrupted operation, complete comment retrieval, ranking outcomes, or the accuracy of generated analysis.",
          "To the extent permitted by law, the CommentScope operator is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          `We may update these terms as CommentScope evolves. Continued use after an updated effective date means you accept the revised terms. Questions can be sent to ${SUPPORT_EMAIL}.`,
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "How can we help?",
    description: "Contact CommentScope for product support, privacy requests, data deletion, or security concerns.",
    intro: "Contact the CommentScope team for product support, privacy questions, account-data requests, or responsible security reports.",
    sections: [
      {
        heading: "Email support",
        paragraphs: [
          <span key="support-email">Email <MuiLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</MuiLink>. Include the email address associated with your account and a short description of the issue. Never send your password, access token, reset link, API key, or other secret.</span>,
        ],
      },
      {
        heading: "Privacy and deletion requests",
        paragraphs: [
          "Use the subject “Privacy request” or “Account deletion request.” We may need to verify that you control the relevant account before acting. Deleting CommentScope data does not remove comments or other information stored by YouTube.",
        ],
      },
      {
        heading: "Security reports",
        paragraphs: [
          "Use the subject “Security report” and explain the issue without accessing other users' data or disrupting the service. Please do not publish sensitive details before we have had a reasonable opportunity to investigate.",
        ],
      },
    ],
  },
};

function PageMetadata({ page, title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    const previousDescription = descriptionTag?.getAttribute("content");
    const previousCanonical = canonicalTag?.getAttribute("href");

    document.title = `${title} | CommentScope`;
    descriptionTag?.setAttribute("content", description);
    canonicalTag?.setAttribute("href", `${SITE_URL}/${page}`);

    return () => {
      document.title = previousTitle;
      if (previousDescription) descriptionTag?.setAttribute("content", previousDescription);
      if (previousCanonical) canonicalTag?.setAttribute("href", previousCanonical);
    };
  }, [page, title, description]);

  return null;
}

export default function PublicInfoPage({ page }) {
  const content = pages[page] || pages.about;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <PageMetadata page={page} title={content.eyebrow} description={content.description} />

      <Box component="header" sx={{ bgcolor: "rgba(255,255,255,0.94)", borderBottom: "1px solid", borderColor: "divider", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(14px)" }}>
        <Container maxWidth={false} sx={{ maxWidth: 1080, py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: "none" }}><BrandMark /></Box>
            <Button component={RouterLink} to="/" color="secondary" startIcon={<ArrowBackRoundedIcon />}>Home</Button>
          </Stack>
        </Container>
      </Box>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth={false} sx={{ maxWidth: 920, py: { xs: 6, md: 9 } }}>
          <Typography variant="overline" color="primary" fontWeight={750}>{content.eyebrow}</Typography>
          <Typography component="h1" variant="h2" mt={1} mb={2}>{content.title}</Typography>
          <Typography color="text.secondary" fontSize="1.08rem" lineHeight={1.8} maxWidth={800}>{content.intro}</Typography>

          <Paper sx={{ mt: 5, p: { xs: 3, md: 5 } }}>
            <Stack spacing={4} divider={<Divider flexItem />}>
              {content.sections.map((section) => (
                <Box component="section" key={section.heading}>
                  <Typography component="h2" variant="h4" mb={1.5}>{section.heading}</Typography>
                  {section.paragraphs?.map((paragraph, index) => (
                    <Typography key={index} color="text.secondary" lineHeight={1.8} mb={1.25}>{paragraph}</Typography>
                  ))}
                  {section.bullets && (
                    <Box component="ul" sx={{ pl: 3, my: 1, color: "text.secondary" }}>
                      {section.bullets.map((item) => (
                        <Typography component="li" key={item} color="text.secondary" lineHeight={1.75} mb={0.75}>{item}</Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "#fff" }}>
        <Container maxWidth={false} sx={{ maxWidth: 1080, py: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.25}>
            <BrandMark />
            <Stack spacing={0.75} alignItems={{ sm: "flex-end" }}>
              <PublicFooterLinks />
              <Typography variant="caption" color="text.secondary">Independent audience analytics. Not affiliated with YouTube.</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

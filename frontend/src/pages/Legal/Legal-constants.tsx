export const PRIVACY_SECTIONS = [
  { 
    num: '01', 
    title: 'Data Collection', 
    content: 'Flowscribe requires access to your source code repository to function. We only collect the minimal metadata necessary to parse and map your architecture. Your raw source code is processed entirely in-memory and is never stored persistently on our servers without explicit opt-in.' 
  },
  { 
    num: '02', 
    title: 'Cookies & Analytics', 
    content: 'We use essential cookies to maintain your session state and authentication. We do not use third-party tracking cookies or advertising pixels. Anonymous, aggregated telemetry may be collected strictly to monitor system performance and improve the parsing engine.' 
  },
  { 
    num: '03', 
    title: 'Security Infrastructure', 
    content: 'All code analysis is performed in isolated, zero-knowledge container environments. Connections are secured using TLS 1.3, and any persistent metadata is encrypted at rest using AES-256. We undergo regular third-party security audits.' 
  },
  { 
    num: '04', 
    title: 'Data Retention & Deletion', 
    content: 'You have absolute control over your data. Upon account deletion or repository disconnection, all associated architectural blueprints, generated diagrams, and metadata are permanently purged from our active databases within 24 hours.' 
  }
];

export const TERMS_SECTIONS = [
  { 
    num: '01', 
    title: 'General Agreement', 
    content: 'By accessing Flowscribe, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in Flowscribe are protected by applicable copyright and trademark law.' 
  },
  { 
    num: '02', 
    title: 'Intellectual Property', 
    content: 'You retain all rights and ownership to the source code you analyze using Flowscribe. We claim no ownership over your code, repositories, or the resulting architectural blueprints generated for your account. The Flowscribe platform itself, however, remains the exclusive property of Flowscribe Inc.' 
  },
  { 
    num: '03', 
    title: 'Acceptable Use Policy', 
    content: 'You agree not to use Flowscribe to analyze malicious code, malware, or systems intended to cause harm. You must have explicit authorization to access and analyze any repository you connect to the platform. Abuse of the parsing engine or API limits will result in immediate termination.' 
  },
  { 
    num: '04', 
    title: 'Data Storage & Liability', 
    content: 'While we employ military-grade isolation to protect your data, Flowscribe is provided "as is". We are not liable for any damages arising out of the use or inability to use the platform, including but not limited to loss of data, business interruption, or security breaches of your underlying repositories.' 
  }
];

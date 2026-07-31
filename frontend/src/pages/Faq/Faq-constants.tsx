export const FAQ_CATEGORIES = [
  "General",
  "Security & Privacy",
  "Integration & Features"
];

export const FAQ_DATA = {
  "General": [
    { 
      title: 'What programming languages does Flowscribe support?', 
      content: 'Flowscribe supports all major programming languages including TypeScript, JavaScript, Python, Go, Rust, Java, and C++. Our parsing engine is designed to intelligently map architectures regardless of the underlying stack.' 
    },
    { 
      title: 'How do you handle large monorepos?', 
      content: 'Our parsing engine was built with enterprise scale in mind. We use localized incremental processing and AST caching to ensure that even massive monorepos are mapped quickly and efficiently without timing out.' 
    },
    { 
      title: 'Can I export the generated blueprints?', 
      content: 'Absolutely. All architectural diagrams can be exported in various formats including PNG, SVG, and structured JSON for use in your internal wikis or developer portals.' 
    }
  ],
  "Security & Privacy": [
    { 
      title: 'Is my source code stored on your servers?', 
      content: 'No. Flowscribe utilizes a zero-knowledge architecture. Your code is processed entirely in-memory within isolated containers to extract architectural metadata. The raw code is never stored persistently on our servers.' 
    },
    { 
      title: 'How secure is the connection?', 
      content: 'All connections are secured using TLS 1.3. We undergo regular third-party security audits to ensure our infrastructure meets or exceeds industry standards.' 
    },
    { 
      title: 'What happens when I delete my account?', 
      content: 'You have absolute control over your data. Upon account deletion or repository disconnection, all associated architectural blueprints, generated diagrams, and metadata are permanently purged from our active databases within 24 hours.' 
    }
  ],
  "Integration & Features": [
    { 
      title: 'Can I integrate this with my CI/CD pipeline?', 
      content: 'Yes! Flowscribe seamlessly integrates with GitHub Actions, GitLab CI, and Bitbucket Pipelines. You can configure it to automatically analyze and comment on pull requests with architectural diffs before they are merged.' 
    },
    { 
      title: 'Do you support custom architecture rules?', 
      content: 'Yes, you can define custom architectural boundaries and rules in a configuration file within your repo. Flowscribe will automatically validate these rules during CI/CD.' 
    }
  ]
};

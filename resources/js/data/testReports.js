export const testReports = [
  {
    id: 1,
    name: 'AZ-900: Microsoft Azure Fundamentals',
    description: 'Fundamentos de Microsoft Azure',
    lastAttempt: {
      date: '2025-03-15T10:30:00',
      mode: 'certification',
      score: 85,
      passed: true,
      duration: '45 min',
      correctAnswers: 34,
      incorrectAnswers: 6
    },
    attempts: [
      {
        id: 1,
        date: '2025-03-15T10:30:00',
        mode: 'certification',
        score: 85,
        passed: true,
        duration: '45 min',
        correctAnswers: 34,
        incorrectAnswers: 6
      },
      {
        id: 2,
        date: '2025-03-14T15:45:00',
        mode: 'practice',
        score: 78,
        passed: false,
        duration: '40 min',
        correctAnswers: 31,
        incorrectAnswers: 9
      }
    ],
    objectives: {
      masteredCount: 3,
      improvingCount: 2,
      needsImprovementCount: 1,
      list: [
        {
          id: 1,
          name: 'Cloud Concepts',
          description: 'Understanding cloud computing concepts and Azure services',
          mastery: 85,
          questions: [
            {
              id: 1,
              text: 'What is the main benefit of cloud computing?',
              explanation: 'Cloud computing provides on-demand access to computing resources without requiring direct management.',
              correct: true
            },
            {
              id: 2,
              text: 'Which cloud service model provides the most control over infrastructure?',
              explanation: 'IaaS provides the most control as you manage the infrastructure while the cloud provider manages the physical hardware.',
              correct: true
            }
          ]
        },
        {
          id: 2,
          name: 'Azure Architecture',
          description: 'Understanding Azure architecture components and services',
          mastery: 75,
          questions: [
            {
              id: 3,
              text: 'What is an Azure Region?',
              explanation: 'An Azure Region is a geographical area containing one or more datacenters.',
              correct: true
            },
            {
              id: 4,
              text: 'Which Azure service provides global load balancing?',
              explanation: 'Azure Traffic Manager provides global load balancing across multiple regions.',
              correct: false
            }
          ]
        },
        {
          id: 3,
          name: 'Azure Services',
          description: 'Understanding core Azure services and their use cases',
          mastery: 90,
          questions: [
            {
              id: 5,
              text: 'What is Azure App Service used for?',
              explanation: 'Azure App Service is used for hosting web applications and APIs.',
              correct: true
            },
            {
              id: 6,
              text: 'Which service is best for storing unstructured data?',
              explanation: 'Azure Blob Storage is designed for storing unstructured data like images, videos, and documents.',
              correct: true
            }
          ]
        },
        {
          id: 4,
          name: 'Security and Compliance',
          description: 'Understanding Azure security features and compliance standards',
          mastery: 65,
          questions: [
            {
              id: 7,
              text: 'What is Azure Key Vault used for?',
              explanation: 'Azure Key Vault is used for storing and managing secrets, keys, and certificates.',
              correct: true
            },
            {
              id: 8,
              text: 'Which Azure service provides DDoS protection?',
              explanation: 'Azure DDoS Protection provides protection against DDoS attacks.',
              correct: false
            }
          ]
        },
        {
          id: 5,
          name: 'Pricing and Support',
          description: 'Understanding Azure pricing models and support options',
          mastery: 70,
          questions: [
            {
              id: 9,
              text: 'What is the difference between Pay-as-you-go and Reserved Instances?',
              explanation: 'Reserved Instances provide cost savings for long-term commitments.',
              correct: true
            },
            {
              id: 10,
              text: 'Which support plan includes 24/7 technical support?',
              explanation: 'Professional Direct support plan includes 24/7 technical support.',
              correct: false
            }
          ]
        },
        {
          id: 6,
          name: 'Identity and Access',
          description: 'Understanding Azure identity and access management',
          mastery: 55,
          questions: [
            {
              id: 11,
              text: 'What is Azure AD used for?',
              explanation: 'Azure AD is used for identity and access management in Azure.',
              correct: true
            },
            {
              id: 12,
              text: 'Which authentication method is most secure?',
              explanation: 'Multi-factor authentication provides the highest level of security.',
              correct: false
            }
          ]
        }
      ]
    },
    calendar: {
      weeks: [
        {
          days: [
            {
              date: '2025-03-15',
              activities: [
                {
                  id: 1,
                  mode: 'certification',
                  time: '10:30',
                  score: 85,
                  duration: '45 min',
                  questions: 40,
                  objectives: 3
                }
              ]
            }
          ]
        }
      ]
    },
    questions: [
      {
        id: 1,
        text: 'What is the main benefit of cloud computing?',
        objective: 'Cloud Concepts',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Lower costs',
          'On-demand access to resources',
          'Better security',
          'Faster performance'
        ],
        correctAnswer: 'On-demand access to resources',
        userAnswer: 'On-demand access to resources',
        explanation: 'Cloud computing provides on-demand access to computing resources without requiring direct management.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 2,
        text: 'Which cloud service model provides the most control over infrastructure?',
        objective: 'Cloud Concepts',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'SaaS',
          'PaaS',
          'IaaS',
          'FaaS'
        ],
        correctAnswer: 'IaaS',
        userAnswer: 'IaaS',
        explanation: 'IaaS provides the most control as you manage the infrastructure while the cloud provider manages the physical hardware.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 3,
        text: 'What is an Azure Region?',
        objective: 'Azure Architecture',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'A virtual network',
          'A geographical area with datacenters',
          'A storage account',
          'A resource group'
        ],
        correctAnswer: 'A geographical area with datacenters',
        userAnswer: 'A geographical area with datacenters',
        explanation: 'An Azure Region is a geographical area containing one or more datacenters.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 4,
        text: 'Which Azure service provides global load balancing?',
        objective: 'Azure Architecture',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Azure Load Balancer',
          'Azure Traffic Manager',
          'Azure Front Door',
          'Azure CDN'
        ],
        correctAnswer: 'Azure Front Door',
        userAnswer: 'Azure Traffic Manager',
        explanation: 'Azure Front Door provides global load balancing with additional features like WAF and CDN.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: false
          },
          {
            date: '2025-03-15T10:30:00',
            correct: false
          }
        ]
      },
      {
        id: 5,
        text: 'What is Azure App Service used for?',
        objective: 'Azure Services',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Database hosting',
          'Web application hosting',
          'Virtual machine management',
          'Network security'
        ],
        correctAnswer: 'Web application hosting',
        userAnswer: 'Web application hosting',
        explanation: 'Azure App Service is used for hosting web applications and APIs.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 6,
        text: 'Which service is best for storing unstructured data?',
        objective: 'Azure Services',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Azure SQL Database',
          'Azure Table Storage',
          'Azure Blob Storage',
          'Azure Cosmos DB'
        ],
        correctAnswer: 'Azure Blob Storage',
        userAnswer: 'Azure Blob Storage',
        explanation: 'Azure Blob Storage is designed for storing unstructured data like images, videos, and documents.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 7,
        text: 'What is Azure Key Vault used for?',
        objective: 'Security and Compliance',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Virtual machine management',
          'Secret and key management',
          'Network security',
          'Database hosting'
        ],
        correctAnswer: 'Secret and key management',
        userAnswer: 'Secret and key management',
        explanation: 'Azure Key Vault is used for storing and managing secrets, keys, and certificates.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 8,
        text: 'Which Azure service provides DDoS protection?',
        objective: 'Security and Compliance',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Azure Firewall',
          'Azure DDoS Protection',
          'Azure Security Center',
          'Azure Sentinel'
        ],
        correctAnswer: 'Azure DDoS Protection',
        userAnswer: 'Azure Security Center',
        explanation: 'Azure DDoS Protection provides protection against DDoS attacks.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: false
          },
          {
            date: '2025-03-15T10:30:00',
            correct: false
          }
        ]
      },
      {
        id: 9,
        text: 'What is the difference between Pay-as-you-go and Reserved Instances?',
        objective: 'Pricing and Support',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Performance',
          'Cost savings for long-term commitments',
          'Security features',
          'Support level'
        ],
        correctAnswer: 'Cost savings for long-term commitments',
        userAnswer: 'Cost savings for long-term commitments',
        explanation: 'Reserved Instances provide cost savings for long-term commitments.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 10,
        text: 'Which support plan includes 24/7 technical support?',
        objective: 'Pricing and Support',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Basic',
          'Developer',
          'Professional Direct',
          'Enterprise'
        ],
        correctAnswer: 'Professional Direct',
        userAnswer: 'Enterprise',
        explanation: 'Professional Direct support plan includes 24/7 technical support.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: false
          },
          {
            date: '2025-03-15T10:30:00',
            correct: false
          }
        ]
      },
      {
        id: 11,
        text: 'What is Azure AD used for?',
        objective: 'Identity and Access',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Database management',
          'Identity and access management',
          'Network security',
          'Cost management'
        ],
        correctAnswer: 'Identity and access management',
        userAnswer: 'Identity and access management',
        explanation: 'Azure AD is used for identity and access management in Azure.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: true
          },
          {
            date: '2025-03-15T10:30:00',
            correct: true
          }
        ]
      },
      {
        id: 12,
        text: 'Which authentication method is most secure?',
        objective: 'Identity and Access',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Password authentication',
          'SSH keys',
          'Multi-factor authentication',
          'Certificate-based authentication'
        ],
        correctAnswer: 'Multi-factor authentication',
        userAnswer: 'Certificate-based authentication',
        explanation: 'Multi-factor authentication provides the highest level of security.',
        attemptHistory: [
          {
            date: '2025-03-14T15:45:00',
            correct: false
          },
          {
            date: '2025-03-15T10:30:00',
            correct: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'AZ-204: Developing Solutions for Microsoft Azure',
    description: 'Desarrollo de soluciones para Microsoft Azure',
    lastAttempt: {
      date: '2025-03-14T09:15:00',
      mode: 'practice',
      score: 72,
      passed: false,
      duration: '50 min',
      correctAnswers: 29,
      incorrectAnswers: 11
    },
    attempts: [
      {
        id: 1,
        date: '2025-03-14T09:15:00',
        mode: 'practice',
        score: 72,
        passed: false,
        duration: '50 min',
        correctAnswers: 29,
        incorrectAnswers: 11
      },
      {
        id: 2,
        date: '2025-03-13T14:20:00',
        mode: 'practice',
        score: 68,
        passed: false,
        duration: '45 min',
        correctAnswers: 27,
        incorrectAnswers: 13
      }
    ],
    objectives: {
      masteredCount: 2,
      improvingCount: 3,
      needsImprovementCount: 2,
      list: [
        {
          id: 1,
          name: 'Azure App Development',
          description: 'Developing and deploying Azure applications',
          mastery: 85,
          questions: [
            {
              id: 1,
              text: 'What is the purpose of Azure App Service?',
              explanation: 'Azure App Service is used for hosting web applications and APIs.',
              correct: true
            },
            {
              id: 2,
              text: 'Which deployment method is recommended for production?',
              explanation: 'Slot-based deployment provides zero-downtime deployments.',
              correct: true
            }
          ]
        },
        {
          id: 2,
          name: 'Azure Storage',
          description: 'Working with Azure storage solutions',
          mastery: 75,
          questions: [
            {
              id: 3,
              text: 'What is the difference between Blob and Table storage?',
              explanation: 'Blob storage is for unstructured data, while Table storage is for structured data.',
              correct: true
            },
            {
              id: 4,
              text: 'Which storage type is best for frequently accessed data?',
              explanation: 'Hot storage tier is optimized for frequently accessed data.',
              correct: false
            }
          ]
        },
        {
          id: 3,
          name: 'Azure Functions',
          description: 'Developing serverless applications',
          mastery: 70,
          questions: [
            {
              id: 5,
              text: 'What is the main benefit of Azure Functions?',
              explanation: 'Azure Functions provides serverless computing capabilities.',
              correct: true
            },
            {
              id: 6,
              text: 'Which trigger type is most common?',
              explanation: 'HTTP trigger is the most common trigger type for Azure Functions.',
              correct: false
            }
          ]
        },
        {
          id: 4,
          name: 'Azure Security',
          description: 'Implementing security in Azure applications',
          mastery: 65,
          questions: [
            {
              id: 7,
              text: 'What is the purpose of Managed Identities?',
              explanation: 'Managed Identities provide secure access to Azure resources.',
              correct: true
            },
            {
              id: 8,
              text: 'Which authentication method is recommended for APIs?',
              explanation: 'OAuth 2.0 is the recommended authentication method for APIs.',
              correct: false
            }
          ]
        },
        {
          id: 5,
          name: 'Azure Monitoring',
          description: 'Monitoring and logging Azure applications',
          mastery: 60,
          questions: [
            {
              id: 9,
              text: 'What is Application Insights used for?',
              explanation: 'Application Insights provides application performance monitoring.',
              correct: true
            },
            {
              id: 10,
              text: 'Which metric is most important for monitoring?',
              explanation: 'Response time is the most important metric for monitoring.',
              correct: false
            }
          ]
        },
        {
          id: 6,
          name: 'Azure Integration',
          description: 'Integrating Azure services',
          mastery: 55,
          questions: [
            {
              id: 11,
              text: 'What is Azure Service Bus used for?',
              explanation: 'Azure Service Bus provides message queuing and topic-based messaging.',
              correct: true
            },
            {
              id: 12,
              text: 'Which integration pattern is best for real-time?',
              explanation: 'Event Grid is best for real-time event processing.',
              correct: false
            }
          ]
        },
        {
          id: 7,
          name: 'Azure DevOps',
          description: 'Using Azure DevOps for development',
          mastery: 50,
          questions: [
            {
              id: 13,
              text: 'What is Azure Pipelines used for?',
              explanation: 'Azure Pipelines provides CI/CD capabilities.',
              correct: true
            },
            {
              id: 14,
              text: 'Which deployment strategy is most reliable?',
              explanation: 'Blue-Green deployment provides the most reliable deployment strategy.',
              correct: false
            }
          ]
        }
      ]
    },
    calendar: {
      weeks: [
        {
          days: [
            {
              date: '2025-03-14',
              activities: [
                {
                  id: 1,
                  mode: 'practice',
                  time: '09:15',
                  score: 72,
                  duration: '50 min',
                  questions: 40,
                  objectives: 4
                }
              ]
            }
          ]
        }
      ]
    },
    questions: [
      {
        id: 1,
        text: 'What is the purpose of Azure App Service?',
        objective: 'Azure App Development',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Database hosting',
          'Web application hosting',
          'Virtual machine management',
          'Network security'
        ],
        correctAnswer: 'Web application hosting',
        userAnswer: 'Web application hosting',
        explanation: 'Azure App Service is used for hosting web applications and APIs.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 2,
        text: 'Which deployment method is recommended for production?',
        objective: 'Azure App Development',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'FTP deployment',
          'Slot-based deployment',
          'Git deployment',
          'Manual deployment'
        ],
        correctAnswer: 'Slot-based deployment',
        userAnswer: 'Slot-based deployment',
        explanation: 'Slot-based deployment provides zero-downtime deployments.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 3,
        text: 'What is the difference between Blob and Table storage?',
        objective: 'Azure Storage',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Performance',
          'Cost',
          'Data structure',
          'Security'
        ],
        correctAnswer: 'Data structure',
        userAnswer: 'Data structure',
        explanation: 'Blob storage is for unstructured data, while Table storage is for structured data.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 4,
        text: 'Which storage type is best for frequently accessed data?',
        objective: 'Azure Storage',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Archive storage',
          'Cool storage',
          'Hot storage',
          'Standard storage'
        ],
        correctAnswer: 'Hot storage',
        userAnswer: 'Standard storage',
        explanation: 'Hot storage tier is optimized for frequently accessed data.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      },
      {
        id: 5,
        text: 'What is the main benefit of Azure Functions?',
        objective: 'Azure Functions',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Cost savings',
          'Serverless computing',
          'Better performance',
          'More control'
        ],
        correctAnswer: 'Serverless computing',
        userAnswer: 'Serverless computing',
        explanation: 'Azure Functions provides serverless computing capabilities.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 6,
        text: 'Which trigger type is most common?',
        objective: 'Azure Functions',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Timer trigger',
          'HTTP trigger',
          'Queue trigger',
          'Event Grid trigger'
        ],
        correctAnswer: 'HTTP trigger',
        userAnswer: 'Timer trigger',
        explanation: 'HTTP trigger is the most common trigger type for Azure Functions.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      },
      {
        id: 7,
        text: 'What is the purpose of Managed Identities?',
        objective: 'Azure Security',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Cost management',
          'Performance optimization',
          'Secure access to resources',
          'Network security'
        ],
        correctAnswer: 'Secure access to resources',
        userAnswer: 'Secure access to resources',
        explanation: 'Managed Identities provide secure access to Azure resources.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 8,
        text: 'Which authentication method is recommended for APIs?',
        objective: 'Azure Security',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Basic authentication',
          'OAuth 2.0',
          'API key',
          'Certificate'
        ],
        correctAnswer: 'OAuth 2.0',
        userAnswer: 'API key',
        explanation: 'OAuth 2.0 is the recommended authentication method for APIs.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      },
      {
        id: 9,
        text: 'What is Application Insights used for?',
        objective: 'Azure Monitoring',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Cost management',
          'Application performance monitoring',
          'Network security',
          'Database management'
        ],
        correctAnswer: 'Application performance monitoring',
        userAnswer: 'Application performance monitoring',
        explanation: 'Application Insights provides application performance monitoring.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 10,
        text: 'Which metric is most important for monitoring?',
        objective: 'Azure Monitoring',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'CPU usage',
          'Memory usage',
          'Response time',
          'Network traffic'
        ],
        correctAnswer: 'Response time',
        userAnswer: 'CPU usage',
        explanation: 'Response time is the most important metric for monitoring.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      },
      {
        id: 11,
        text: 'What is Azure Service Bus used for?',
        objective: 'Azure Integration',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Database hosting',
          'Message queuing',
          'Network security',
          'Cost management'
        ],
        correctAnswer: 'Message queuing',
        userAnswer: 'Message queuing',
        explanation: 'Azure Service Bus provides message queuing and topic-based messaging.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 12,
        text: 'Which integration pattern is best for real-time?',
        objective: 'Azure Integration',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Service Bus',
          'Event Grid',
          'Logic Apps',
          'API Management'
        ],
        correctAnswer: 'Event Grid',
        userAnswer: 'Service Bus',
        explanation: 'Event Grid is best for real-time event processing.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      },
      {
        id: 13,
        text: 'What is Azure Pipelines used for?',
        objective: 'Azure DevOps',
        correct: true,
        attempted: true,
        attempts: 2,
        options: [
          'Cost management',
          'CI/CD',
          'Network security',
          'Database management'
        ],
        correctAnswer: 'CI/CD',
        userAnswer: 'CI/CD',
        explanation: 'Azure Pipelines provides CI/CD capabilities.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: true
          },
          {
            date: '2025-03-14T09:15:00',
            correct: true
          }
        ]
      },
      {
        id: 14,
        text: 'Which deployment strategy is most reliable?',
        objective: 'Azure DevOps',
        correct: false,
        attempted: true,
        attempts: 2,
        options: [
          'Rolling deployment',
          'Blue-Green deployment',
          'Canary deployment',
          'Feature flags'
        ],
        correctAnswer: 'Blue-Green deployment',
        userAnswer: 'Rolling deployment',
        explanation: 'Blue-Green deployment provides the most reliable deployment strategy.',
        attemptHistory: [
          {
            date: '2025-03-13T14:20:00',
            correct: false
          },
          {
            date: '2025-03-14T09:15:00',
            correct: false
          }
        ]
      }
    ]
  }
] 
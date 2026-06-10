const medicalDataset = {
  symptoms: [
    { id: "fever", name: "High Fever", category: "General", bodyPart: "general" },
    { id: "cough", name: "Persistent Cough", category: "Respiratory", bodyPart: "chest" },
    { id: "headache", name: "Severe Headache", category: "Neurological", bodyPart: "head" },
    { id: "fatigue", name: "Extreme Fatigue", category: "General", bodyPart: "general" },
    { id: "sore_throat", name: "Sore Throat", category: "Respiratory", bodyPart: "head" },
    { id: "runny_nose", name: "Runny or Stuffy Nose", category: "Respiratory", bodyPart: "head" },
    { id: "shortness_of_breath", name: "Shortness of Breath", category: "Respiratory", bodyPart: "chest" },
    { id: "body_aches", name: "Muscle or Body Aches", category: "General", bodyPart: "general" },
    { id: "loss_of_taste_smell", name: "Loss of Taste or Smell", category: "Neurological", bodyPart: "head" },
    { id: "nausea", name: "Nausea or Vomiting", category: "Gastrointestinal", bodyPart: "abdomen" },
    { id: "diarrhea", name: "Watery Diarrhea", category: "Gastrointestinal", bodyPart: "abdomen" },
    { id: "chest_pain", name: "Chest Pain or Tightness", category: "Cardiovascular", bodyPart: "chest" },
    { id: "dizziness", name: "Dizziness or Lightheadedness", category: "Neurological", bodyPart: "head" },
    { id: "sneezing", name: "Frequent Sneezing", category: "Respiratory", bodyPart: "head" },
    { id: "itchy_eyes", name: "Itchy, Watery, or Red Eyes", category: "General", bodyPart: "head" },
    { id: "joint_pain", name: "Joint Pain or Stiffness", category: "General", bodyPart: "limbs" },
    { id: "skin_rash", name: "Skin Rash or Itching", category: "Dermatological", bodyPart: "general" },
    { id: "abdominal_pain", name: "Abdominal Pain or Cramps", category: "Gastrointestinal", bodyPart: "abdomen" },
    { id: "acid_reflux", name: "Heartburn or Acid Reflux", category: "Gastrointestinal", bodyPart: "abdomen" },
    { id: "frequent_urination", name: "Frequent Urination", category: "Urinary", bodyPart: "abdomen" },
    { id: "excessive_thirst", name: "Excessive Thirst", category: "General", bodyPart: "general" },
    { id: "wheezing", name: "Wheezing Sounds", category: "Respiratory", bodyPart: "chest" },
    { id: "chills", name: "Chills and Shivering", category: "General", bodyPart: "general" },
    { id: "sweating", name: "Excessive Sweating", category: "General", bodyPart: "general" },
    { id: "stiff_neck", name: "Stiff Neck", category: "Neurological", bodyPart: "head" },
    { id: "anxiety", name: "Anxiety or Heart Palpitations", category: "Neurological", bodyPart: "general" },
    { id: "insomnia", name: "Insomnia or Sleep Disturbances", category: "General", bodyPart: "general" },
    { id: "weight_loss", name: "Unexplained Weight Loss", category: "General", bodyPart: "general" },
    { id: "bloating", name: "Bloating and Gas", category: "Gastrointestinal", bodyPart: "abdomen" },
    { id: "constipation", name: "Constipation", category: "Gastrointestinal", bodyPart: "abdomen" }
  ],
  diseases: [
    {
      id: "influenza",
      name: "Influenza (Flu)",
      description: "A highly contagious viral infection that attacks your respiratory system, including nose, throat and lungs. It is common during seasonal cycles.",
      symptoms: ["fever", "cough", "fatigue", "sore_throat", "runny_nose", "body_aches", "chills", "headache"],
      causes: [
        "Influenza viruses spreading through droplets when infected people cough, sneeze, or talk.",
        "Touching contaminated surfaces and then touching eyes, nose, or mouth."
      ],
      prevention: [
        "Get an annual flu vaccination.",
        "Wash your hands frequently with soap and water.",
        "Avoid close contact with people who are sick."
      ],
      recommendations: [
        "Get plenty of rest to help your body fight the infection.",
        "Drink lots of fluids (water, broth, herbal tea) to prevent dehydration.",
        "Use over-the-counter pain relievers for fever and aches.",
        "Consult a doctor for antiviral prescription medications if symptoms are severe."
      ]
    },
    {
      id: "covid_19",
      name: "COVID-19",
      description: "An infectious respiratory illness caused by the SARS-CoV-2 virus, which can lead to mild to severe symptoms and affect multiple organ systems.",
      symptoms: ["fever", "cough", "fatigue", "loss_of_taste_smell", "shortness_of_breath", "sore_throat", "body_aches", "headache", "chills"],
      causes: [
        "SARS-CoV-2 virus transmitted through respiratory droplets, aerosols, or close contact.",
        "Inhaling droplets from an infected individual coughing, sneezing, or speaking."
      ],
      prevention: [
        "Stay up-to-date with COVID-19 vaccinations.",
        "Wear masks in crowded or poorly ventilated indoor spaces.",
        "Maintain physical distancing from others."
      ],
      recommendations: [
        "Self-isolate to prevent spreading the virus to others.",
        "Monitor your oxygen levels and symptoms closely.",
        "Seek immediate medical attention if you experience difficulty breathing.",
        "Rest, stay hydrated, and take fever reducers if symptoms remain mild."
      ]
    },
    {
      id: "common_cold",
      name: "Common Cold",
      description: "A mild viral infection of the nose and throat, characterized by nasal congestion, sneezing, and runny nose, typically resolving in 7-10 days.",
      symptoms: ["cough", "sore_throat", "runny_nose", "sneezing", "headache", "fatigue"],
      causes: [
        "Over 200 strains of viruses, most commonly Rhinoviruses.",
        "Airborne droplets or direct contact with secretions of an infected person."
      ],
      prevention: [
        "Wash hands frequently and avoid touching your face.",
        "Disinfect frequently touched surfaces.",
        "Avoid sharing cups or utensils with sick individuals."
      ],
      recommendations: [
        "Stay warm and rest.",
        "Inhale steam or use saline nasal sprays to relieve congestion.",
        "Stay hydrated with water or warm soups."
      ]
    },
    {
      id: "migraine",
      name: "Migraine Headache",
      description: "A neurological condition characterized by intense, throbbing headaches, often accompanied by nausea, vomiting, and sensitivity to light and sound.",
      symptoms: ["headache", "nausea", "dizziness", "fatigue"],
      causes: [
        "Genetic factors and environmental triggers affecting brain activity and blood vessels.",
        "Triggers like stress, hormonal changes, certain foods, or lack of sleep."
      ],
      prevention: [
        "Identify and avoid known migraine triggers.",
        "Maintain a consistent sleep, eating, and exercise schedule.",
        "Practice stress management techniques."
      ],
      recommendations: [
        "Rest in a quiet, dark, and cool room when an attack begins.",
        "Apply a cold compress to your forehead or neck.",
        "Take prescribed pain relievers early in the attack."
      ]
    },
    {
      id: "asthma",
      name: "Bronchial Asthma",
      description: "A chronic condition that affects the airways in the lungs, causing them to become inflamed, narrow, and produce extra mucus, making breathing difficult.",
      symptoms: ["cough", "shortness_of_breath", "wheezing", "chest_pain"],
      causes: [
        "A combination of genetic predisposition and environmental exposure to allergens.",
        "Triggers such as pollen, dust mites, exercise, cold air, or smoke."
      ],
      prevention: [
        "Avoid triggers like cigarette smoke, dust, and pollen.",
        "Use prescribed preventative inhalers consistently."
      ],
      recommendations: [
        "Always carry a quick-relief rescue inhaler (albuterol).",
        "Monitor your breathing using a peak flow meter if advised.",
        "Seek emergency medical help if breathing difficulty rapidly worsens."
      ]
    },
    {
      id: "diabetes",
      name: "Type 2 Diabetes",
      description: "A chronic metabolic condition characterized by high levels of blood glucose, occurring when the body becomes resistant to insulin or doesn't make enough.",
      symptoms: ["frequent_urination", "excessive_thirst", "fatigue", "weight_loss"],
      causes: [
        "Insulin resistance where body cells do not respond effectively to insulin.",
        "Genetic predisposition, overweight, physical inactivity, and poor diet."
      ],
      prevention: [
        "Maintain a healthy body weight.",
        "Engage in regular physical activity (at least 150 minutes per week).",
        "Eat a balanced diet high in fiber and low in refined sugars."
      ],
      recommendations: [
        "Monitor blood sugar levels regularly.",
        "Take prescribed oral medications or insulin as directed.",
        "Schedule regular checkups to monitor kidney, eye, and cardiovascular health."
      ]
    },
    {
      id: "gerd",
      name: "GERD (Acid Reflux)",
      description: "Gastroesophageal reflux disease occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach, irritating the lining.",
      symptoms: ["acid_reflux", "abdominal_pain", "bloating", "chest_pain"],
      causes: [
        "Weakness or relaxation of the lower esophageal sphincter (LES).",
        "Hiatal hernia, obesity, pregnancy, smoking, or eating large meals before lying down."
      ],
      prevention: [
        "Avoid trigger foods like spicy, fatty, acidic foods, caffeine, and chocolate.",
        "Eat smaller, more frequent meals.",
        "Do not lie down for at least 3 hours after eating."
      ],
      recommendations: [
        "Take antacids or proton pump inhibitors (PPIs) as recommended.",
        "Avoid tight-fitting clothing around the waist.",
        "Maintain a healthy weight."
      ]
    },
    {
      id: "hypertension",
      name: "Hypertension (High Blood Pressure)",
      description: "A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause heart disease or stroke.",
      symptoms: ["headache", "dizziness", "chest_pain", "fatigue"],
      causes: [
        "Primary hypertension: Develops gradually over many years with no identifiable cause.",
        "Secondary hypertension: Caused by conditions like kidney disease or medications."
      ],
      prevention: [
        "Limit sodium (salt) intake in your diet.",
        "Exercise regularly and manage stress.",
        "Limit alcohol consumption and avoid smoking."
      ],
      recommendations: [
        "Monitor your blood pressure at home regularly.",
        "Take prescribed blood pressure medications consistently.",
        "Adopt a heart-healthy diet."
      ]
    },
    {
      id: "food_poisoning",
      name: "Food Poisoning",
      description: "An illness caused by eating contaminated, spoiled, or toxic food, resulting in acute gastrointestinal distress.",
      symptoms: ["nausea", "diarrhea", "abdominal_pain", "fever", "fatigue"],
      causes: [
        "Bacteria (such as Salmonella, E. coli), viruses, or parasites in improperly stored food.",
        "Poor hygiene during food preparation."
      ],
      prevention: [
        "Keep hands, utensils, and food preparation surfaces clean.",
        "Separate raw meats from other foods.",
        "Cook foods to safe internal temperatures."
      ],
      recommendations: [
        "Drink plenty of electrolyte solutions or water to replace lost fluids.",
        "Avoid solid foods for a few hours until the stomach settles.",
        "Gradually reintroduce bland foods (BRAT diet)."
      ]
    },
    {
      id: "allergic_rhinitis",
      name: "Allergic Rhinitis (Allergies)",
      description: "An allergic response causing itchy eyes, sneezing, runny nose, and nasal congestion, triggered by indoor or outdoor allergens.",
      symptoms: ["runny_nose", "sneezing", "itchy_eyes", "sore_throat", "fatigue"],
      causes: [
        "Hypersensitivity of the immune system to harmless substances like pollen, dust mites, or pet dander."
      ],
      prevention: [
        "Keep windows closed during high pollen seasons.",
        "Use allergen-proof covers on pillows and mattresses.",
        "Wash hands after contact with animals."
      ],
      recommendations: [
        "Use over-the-counter antihistamines or nasal sprays.",
        "Perform nasal irrigation using a saline rinse.",
        "Avoid outdoor activities when pollen counts are highest."
      ]
    }
  ]
};

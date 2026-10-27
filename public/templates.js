(function () {
  'use strict';
  window.STUDIO_TEMPLATES = {
    softening: [
      { text: 'You must sign this contract today.', context: 'Too demanding; sounds like an ultimatum.' },
      { text: "I don't understand your point. Explain it again.", context: 'Sounds accusatory, as if the listener is being dense.' },
      { text: 'Your idea is impossible for our team.', context: 'Too dismissive; shuts down collaboration instantly.' },
      { text: 'You forgot to send the attachment.', context: 'Directly blames the client instead of focusing on the missing file.' },
      { text: 'I need you to help me fix this right now.', context: "Entitled tone; ignores the other person's schedule." },
      { text: 'That is wrong. The data says something else.', context: 'Creates a confrontational atmosphere rather than a constructive discussion.' },
      { text: "I don't care which option we pick.", context: 'Sounds disengaged and passive rather than flexible.' },
      { text: 'Give me feedback on my work.', context: 'Sounds like a blunt command rather than a professional request for guidance.' },
      { text: "You didn't answer my question in the email.", context: 'Accusatory; implies the other party is avoiding the topic or being lazy.' },
      { text: 'I will talk to you later when I am less busy.', context: 'Sounds dismissive and borderline rude.' }
    ],
    pushback: [
      { text: 'We cannot launch tomorrow. The server is completely broken.', context: 'Panic-inducing; lacks an immediate proactive solution.' },
      { text: 'I cannot work this weekend for your emergency.', context: 'Too personal; sounds defensive rather than objective.' },
      { text: 'The client is making a big mistake with this request.', context: 'Violates corporate face-saving protocols by declaring a partner wrong.' },
      { text: 'I am too busy with other work to do this task.', context: 'Sounds uncooperative in team-oriented Korean office cultures.' },
      { text: "Our team didn't meet the target because of marketing.", context: 'Shifts blame directly onto another department, which is poorly received in Western structures.' },
      { text: 'Your budget is way too small for this project.', context: 'Bluntly rejects financial terms without providing a middle-ground proposal.' },
      { text: "I don't know the answer to this issue.", context: 'Terrifying for a manager to say out loud; sounds incompetent without framing.' },
      { text: 'Stop changing the project requirements every week.', context: 'Aggressive frustration directed at a paying client or manager.' },
      { text: 'We need to delay the contract signing.', context: 'Disrupts timeline expectations without giving a strong justification.' },
      { text: "I disagree with my manager's conclusion on this report.", context: 'High-stakes internal conflict; requires incredibly delicate framing.' }
    ],
    zoom: [
      { text: 'I need to break my silence and add an idea right now.' },
      { text: 'The American team is speaking way too fast; I need them to slow down.' },
      { text: 'I need 30 seconds to check my Japanese data sheet before I answer.' },
      { text: 'I want to ask a question, but everyone keeps talking over me.' },
      { text: "I didn't understand the idiom or corporate slang they just used." },
      { text: 'I need to hand the microphone over to my colleague now.' },
      { text: 'I want to bring the conversation back to the main agenda topic.' },
      { text: 'Someone asked me a sudden question, and my mind went completely blank.' },
      { text: 'I want to confirm if everyone can see my shared screen before starting.' },
      { text: 'I need to drop off the call early for a domestic client obligation.' }
    ],
    'supply-chain': [
      { text: 'Chip yield went up 4% this month.', context: 'Turn a flat stat into an impactful business growth story.' },
      { text: 'TSMC shipment is delayed 7 days because of shipping jam at port.', context: 'Explain a major logistics failure without panicking the overseas buyer.' },
      { text: 'The product has a lot of bugs. We need to fix them.', context: "Describe engineering roadblocks without underselling the team's capabilities." },
      { text: 'Look at this slide. The line goes up.', context: 'Elevate weak visual storytelling into strong corporate data analysis.' },
      { text: 'We changed the factory plan to save some money.', context: 'Frame cost-cutting or cost-reduction strategies as proactive optimization.' },
      { text: 'This is the final summary of the whole project.', context: 'Wrap up a high-stakes presentation with an active call to action, avoiding an anti-climactic drop.' },
      { text: "We don't have enough materials to make the hardware next month.", context: 'Flag a critical capacity bottleneck while presenting proactive backup options.' },
      { text: 'We tested the software and it passed the minimum level.', context: 'Shift defensive engineering jargon into confident quality assurance verification.' },
      { text: 'The cost of copper is up, so the price might change.', context: 'Prepare global clients for incoming price adjustments due to raw material macroeconomics.' },
      { text: 'I am going to explain the long history of our design process.', context: 'Pivot away from text-heavy, time-wasting historical context to protect the attention spans of busy executives.' }
    ]
  };
})();

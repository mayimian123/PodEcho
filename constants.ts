import { Podcast } from './types';

export const MOCK_TRANSCRIPT = `
[00:00:00] **Host**: Welcome back to another episode of "The Future of Thought". Today we're discussing the concept of "Active Consumption" versus "Passive Absorption" in the age of infinite media.

[00:00:15] **Guest**: It's great to be here. You know, I was walking down the street yesterday listening to a lecture on quantum mechanics, and five minutes later, I realized I couldn't remember a single sentence. I was hearing it, but I wasn't listening.

[00:00:30] **Host**: Exactly. That's the "Pass-through" effect. We treat information like water flowing through a pipe, hoping some of it leaves a trace. But the brain doesn't work like a sieve; it works more like a muscle. You have to provide resistance to grow.

[00:00:45] **Guest**: Resistance is a great word for it. Richard Feynman had this technique where he wouldn't just read a paper; he would read the title, then stop and try to derive the paper's conclusion himself before reading further. That is active resistance.

[00:01:05] **Host**: I love that. It's about predicting and then correcting. If you just read the solution, you rob yourself of the neural rewiring required to solve the problem. It's like watching someone else lift weights.

[00:01:20] **Guest**: And this applies to podcasts too. If you listen to a 2-hour conversation and don't stop to write down a thought, challenge a premise, or connect it to something you already know, you've essentially just entertained your auditory cortex for 120 minutes.

[00:01:40] **Host**: So, how do we fix this? We need tools that force us to slow down. Tools that make "echoes" instead of just noise. We need to be able to stop the stream, grab a piece of an idea, and wrestle with it.

[00:02:00] **Guest**: "Wrestle with it." I like that. Socratic dialogue with the content itself. Asking: "Why is this true?" "What if the opposite were true?" That's where wisdom comes from. Not from the consumption, but from the digestion.
`;

export const PODCASTS: Podcast[] = [
  {
    id: '1c6b75e',
    title: 'The Future of Thought: Active Consumption',
    host: 'Dr. Sarah Chen & Mark R.',
    description: 'Why we forget 90% of what we hear, and how the "Feynman Technique" can be applied to modern media consumption to turn noise into wisdom.',
    duration: '45 min',
    date: 'Oct 24, 2025',
    imageUrl: 'https://picsum.photos/400/400?grayscale',
    tags: ['Learning', 'Neuroscience', 'Productivity'],
    fullTranscript: MOCK_TRANSCRIPT,
  },
  {
    id: '2',
    title: 'Design Systems for the Soul',
    host: 'Elena V.',
    description: 'Exploring how the spaces we inhabit—digital and physical—shape our emotional landscape and decision-making processes.',
    duration: '32 min',
    date: 'Oct 20, 2025',
    imageUrl: 'https://picsum.photos/400/401?grayscale',
    tags: ['Design', 'Psychology', 'Architecture'],
    fullTranscript: "Transcript unavailable for this demo item.",
  },
  {
    id: '3',
    title: 'The Economics of attention',
    host: 'James Clear',
    description: 'In a world where attention is the new currency, how do we budget our focus? A deep dive into the mechanisms of distraction.',
    duration: '58 min',
    date: 'Oct 15, 2025',
    imageUrl: 'https://picsum.photos/401/400?grayscale',
    tags: ['Economics', 'Focus', 'Tech'],
    fullTranscript: "Transcript unavailable for this demo item.",
  }
];

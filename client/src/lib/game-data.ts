export const gameSteps = {
  1: { // Missing Cookie Mystery
    steps: [
      {
        id: 1,
        title: "Investigate the Kitchen",
        description: "Look around the kitchen for clues about the missing cookie.",
        requiredCharacter: "Detective Sam",
        clues: ["Cookie crumbs on the counter", "Milk glass left out", "Chair moved near the cookie jar"]
      },
      {
        id: 2,
        title: "Interview Family Members",
        description: "Talk to everyone in the house to see what they know.",
        requiredCharacter: "Captain Max",
        clues: ["Mom says she didn't eat it", "Dad was working in his office", "Sister was playing outside"]
      },
      {
        id: 3,
        title: "Examine the Evidence",
        description: "Look closely at all the clues you've gathered.",
        requiredCharacter: "Scout Emma",
        clues: ["Small handprints on the jar", "Cookie crumbs lead to the living room", "Cartoon is on TV"]
      },
      {
        id: 4,
        title: "Solve the Puzzle",
        description: "Put all the pieces together to solve the mystery.",
        requiredCharacter: "Professor Lily",
        clues: ["The little brother took the cookie while watching cartoons"]
      }
    ]
  },
  2: { // Playground Puzzle
    steps: [
      {
        id: 1,
        title: "Survey the Playground",
        description: "Walk around and observe what's different about the playground.",
        requiredCharacter: "Scout Emma",
        clues: ["Swing is moving by itself", "Slide has strange marks", "Sandbox toys are arranged in a pattern"]
      },
      {
        id: 2,
        title: "Look for Hidden Clues",
        description: "Search for clues that might not be obvious.",
        requiredCharacter: "Detective Sam",
        clues: ["Wind chimes hidden in the tree", "Remote control device buried in sandbox", "Automatic timer system"]
      },
      {
        id: 3,
        title: "Talk to the Groundskeeper",
        description: "Interview the person who maintains the playground.",
        requiredCharacter: "Captain Max",
        clues: ["New automatic system installed last week", "Designed to keep kids engaged", "Has a master control panel"]
      },
      {
        id: 4,
        title: "Decode the Pattern",
        description: "Figure out how the automatic system works.",
        requiredCharacter: "Professor Lily",
        clues: ["The playground has a new interactive system to make playtime more fun!"]
      }
    ]
  },
  3: { // Castle Secret
    steps: [
      {
        id: 1,
        title: "Explore the Castle Grounds",
        description: "Walk around the castle and look for anything unusual.",
        requiredCharacter: "Scout Emma",
        clues: ["Strange symbols on the walls", "Hidden door behind the tapestry", "Mysterious footprints in the dust"]
      },
      {
        id: 2,
        title: "Find the Secret Passages",
        description: "Search for hidden passages and secret rooms.",
        requiredCharacter: "Detective Sam",
        clues: ["Lever behind the bookshelf", "Map of secret tunnels", "Hidden chamber with ancient artifacts"]
      },
      {
        id: 3,
        title: "Decipher the Ancient Riddles",
        description: "Solve the puzzles left by the castle's original inhabitants.",
        requiredCharacter: "Professor Lily",
        clues: ["Riddle about the castle's treasure", "Combination lock with symbols", "Ancient diary with clues"]
      },
      {
        id: 4,
        title: "Uncover the Truth",
        description: "Discover what the castle's secret really is.",
        requiredCharacter: "Captain Max",
        clues: ["The castle was built to protect a time capsule from the town's founders"]
      }
    ]
  }
};

export const characterAbilities = {
  "Detective Sam": {
    name: "Clue Detection",
    description: "Can find hidden clues that others miss",
    icon: "fas fa-search"
  },
  "Professor Lily": {
    name: "Puzzle Solving",
    description: "Excellent at solving riddles and puzzles",
    icon: "fas fa-lightbulb"
  },
  "Captain Max": {
    name: "Interviewing",
    description: "Gets more information from witnesses",
    icon: "fas fa-comments"
  },
  "Scout Emma": {
    name: "Observation",
    description: "Notices details others overlook",
    icon: "fas fa-eye"
  }
};

export const difficultyColors = {
  1: "mystery-green",
  2: "mystery-yellow", 
  3: "mystery-red"
};

export const difficultyLabels = {
  1: "Easy",
  2: "Medium",
  3: "Hard"
};

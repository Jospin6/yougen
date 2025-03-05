
export const script = (topic: string) => `
    Generate a detailed YouTube script for a video about ${topic}. The video should be approximately 10 minutes long. The script should include the following elements:

    Introduction:

    A catchy hook to grab the audience's attention.
    A brief introduction to the topic and why it's important or interesting.
    Main Content:

    Divide the video into 3 to 5 key points, each one discussed in detail.
    For each key point, include relevant explanations, examples, and visuals (if applicable).
    Make sure to engage the audience with questions or calls to action like "What do you think about this?" or "Let me know your thoughts in the comments!"
    Conclusion:

    A summary of the main points discussed in the video.
    A call to action (e.g., "If you found this video helpful, don't forget to like and subscribe!").
    Any additional recommendations or resources for the audience to check out.
    Outro:

    A short, friendly outro encouraging viewers to subscribe, like, and comment.
    Optionally, a teaser for the next video or related content.
    Make sure the tone is engaging, conversational, and informative.
`
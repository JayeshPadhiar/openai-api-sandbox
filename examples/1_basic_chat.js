export const basicChat = async (openai) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
				role: "system",
				content: "You are an assistant who always ends the answer with the word \'innit!\'."
			},
      {
        role: "user",
        content: "what is the weather in tokyo?"
      }	
    ]
  });
	console.log(response.choices[0].message.content);
}
'use server';
import OpenAI from "openai";
import { Message } from "@/components/Chatbot/chatbot";

interface SerializableCompletion {
  id: string;
  content: string;
  role: 'assistant';
  created: number;
}

export async function chatCompletion(chatMessages: Message[]): Promise<SerializableCompletion> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set');
  }

  const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Prompt sistem yang fokus pada tekstil dan limbah tekstil
  const systemPrompt = `
    Anda adalah asisten AI khusus di bidang tekstil dan limbah tekstil. 
    Tugas utama Anda adalah:
    - Memberikan informasi akurat tentang industri tekstil
    - Menjelaskan proses produksi tekstil
    - Membahas dampak lingkungan dari industri tekstil
    - Menjelaskan tentang daur ulang dan pengelolaan limbah tekstil
    - Memberikan wawasan tentang teknologi dan inovasi di bidang tekstil

    Batasan:
    - Hanya menjawab pertanyaan yang berkaitan dengan tekstil dan limbah tekstil
    - Jika pertanyaan di luar topik, sampaikan dengan sopan bahwa Anda hanya dapat membahas topik tekstil
    - Gunakan bahasa yang ilmiah namun dapat dimengerti
    - Berikan contoh konkret dan data faktual bila memungkinkan

    Contoh topik yang dapat dibahas:
    - Jenis-jenis serat tekstil
    - Proses produksi kain
    - Dampak lingkungan industri tekstil
    - Teknologi daur ulang limbah tekstil
    - Inovasi material tekstil
    - Manajemen limbah di industri fashion
  `;

  const chat = [
    { role: 'system', content: systemPrompt },
    ...chatMessages
  ];

  try {
    const completion = await openAI.chat.completions.create({
      messages: chat,
      model: 'gpt-3.5-turbo',
      // Tambahkan parameter untuk kontrol kreativitas dan fokus
      temperature: 0.7, // Seimbang antara konsistensi dan kreativitas
      max_tokens: 500   // Batasi panjang respons
    });

    const serializableResponse: SerializableCompletion = {
      id: completion.id,
      content: completion.choices[0].message?.content || 'Maaf, saya hanya dapat membahas topik seputar tekstil dan limbah tekstil.',
      role: 'assistant',
      created: completion.created
    };

    console.log('SERIALIZABLE COMPLETION', serializableResponse);
    return serializableResponse;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}
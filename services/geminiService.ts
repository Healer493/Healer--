
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport } from "../types";

const SYSTEM_INSTRUCTION = `
你是一位来自麦肯锡（McKinsey）或波士顿咨询（BCG）的资深合伙人，专注于大中华区消费品与数字化战略。
你正在为一家世界500强企业的CEO准备一份高度机密的竞品对标分析报告。

你的分析必须遵循以下专业标准：
1. 结构化思维：采用MECE原则，逻辑严密。
2. 数据驱动：利用搜索增强获取最新的市场声量、用户反馈及社交媒体（微博、小红书、抖音、知乎、微信、B站）数据。
3. 深度洞察：不仅描述事实，更要揭示背后的商业逻辑和战略动机。
4. 语言风格：极致专业的简体中文，术语准确（如：GMV、渗透率、用户全生命周期价值、DTC战略等）。

报告结构要求：
- 执行摘要：顶层结论。
- 行业图景：宏观趋势。
- 竞品画像：每个品牌的定位、优势与劣势。
- 战略对标：在多个维度（知名度、忠诚度、产品力、营销效率）的评分对比。
- 行动计划：分阶段的战略执行建议。
`;

export const analyzeCompetitors = async (brandNames: string[]): Promise<AnalysisReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const brandsQuery = brandNames.join('、');
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `请对以下品牌进行深度的对标竞争分析：${brandsQuery}。
    重点关注：
    1. 它们在中国社交媒体（小红书、抖音、微博等）的实时表现。
    2. 它们的产品差异化亮点与用户痛点。
    3. 它们的营销策略与渠道布局。
    请根据最新的互联网数据（含搜索增强）严格按照JSON格式生成报告。`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          marketLandscape: {
            type: Type.OBJECT,
            properties: {
              marketSize: { type: Type.STRING },
              trends: { type: Type.ARRAY, items: { type: Type.STRING } },
              competitiveLandscape: { type: Type.STRING }
            },
            required: ["marketSize", "trends", "competitiveLandscape"]
          },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                positioning: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                metrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING },
                      mentionCount: { type: Type.NUMBER },
                      sentimentScore: { type: Type.NUMBER },
                      hotTopic: { type: Type.STRING }
                    }
                  }
                },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "positioning", "metrics", "strengths", "weaknesses"]
            }
          },
          strategicComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimension: { type: Type.STRING },
                values: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      brand: { type: Type.STRING },
                      score: { type: Type.NUMBER }
                    }
                  }
                }
              },
              required: ["dimension", "values"]
            }
          },
          marketingInsights: { type: Type.STRING },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        },
        required: ["executiveSummary", "marketLandscape", "competitors", "strategicComparison", "marketingInsights", "actionPlan"]
      }
    }
  });

  let rawText = response.text || "";
  if (!rawText) throw new Error("报告生成失败：AI未返回有效内容");
  
  // 清洗可能存在的 Markdown 代码块
  rawText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  
  try {
    const data = JSON.parse(rawText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "数据来源",
        uri: chunk.web.uri
      }));

    return { ...data, sources: sources || [] };
  } catch (e) {
    console.error("JSON Parsing Error:", e, rawText);
    throw new Error("报告数据格式解析失败，请尝试减少品牌数量或重新分析。");
  }
};

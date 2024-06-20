import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import { generateTimer } from "../utils/generateTimer";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import AIClass from "../services/ai";
import { getFullCurrentDate } from "src/utils/currentDate";

const PROMPT_SELLER = `Eres el asistente virtual en la prestigiosa barbería "Peluquría nro 1", ubicada en Santa CRuz, centro.Tu principal deber es responder a las consultas de los clientes y ayudarles a programar sus citas.
FECHA DE HOY: {CURRENT_DAY}SOBRE "Peluquería nro 1":Nos distinguimos por ofrecer cortes de cabello modernos y siempre a la vanguardia. Horario lunes a viernes, desde las 09:00 hasta las 17:00.
PRECIOS:Corte de pelo de hombre 6USD Corte de pelo + barba 10 USD
HISTORIAL:{HISTORIAL_CONVERSACION}
EJEMPLOS DE RESPUESTAS:
"Claro, ¿cómo puedo ayudarte a programar tu cita?"
"Recuerda que debes agendar tu cita..."
INSTRUCCIONES: NO saludes
Respuesta útil:`;


export const generatePromptSeller = (history: string) => {
    const nowDate = getFullCurrentDate()
    return PROMPT_SELLER.replace('{HISTORIAL_CONVERSACION}', history).replace('{CURRENT_DAY}', nowDate)
};

/**
 * Hablamos con el PROMPT que sabe sobre las cosas basicas del negocio, info, precio, etc.
 */
const flowSeller = addKeyword(EVENTS.ACTION).addAction(async (_, { state, flowDynamic, extensions }) => {
    try {
        const ai = extensions.ai as AIClass
        const history = getHistoryParse(state)
        const prompt = generatePromptSeller(history)

        const text = await ai.createChat([
            {
                role: 'system',
                content: prompt
            }
        ])

        await handleHistory({ content: text, role: 'assistant' }, state)

        const chunks = text.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
        }
    } catch (err) {
        console.log(`[ERROR]:`, err)
        return
    }
})

export { flowSeller }
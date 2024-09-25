import { supabase } from './supabase'

export async function createUser(id: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id, email }])
    .single()

  if (error) throw error
  return data
}

export async function saveDailyChallengeScore(
  userId: string,
  date: string,
  quantScore: number,
  lrdiScore: number,
  varcScore: number,
  quantAnswers: object,
  lrdiAnswers: object,
  varcAnswers: object
) {
  const { data, error } = await supabase
    .from('daily_challenge_scores')
    .insert([
      {
        user_id: userId,
        date,
        quant_score: quantScore,
        lrdi_score: lrdiScore,
        varc_score: varcScore,
        quant_answers: quantAnswers,
        lrdi_answers: lrdiAnswers,
        varc_answers: varcAnswers,
      },
    ])
    .single()

  if (error) throw error
  return data
}
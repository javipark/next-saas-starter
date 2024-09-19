import { supabase } from '@/lib/supabase/client';

export async function getUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session || !session.session) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error) {
    console.error('Error fetching team:', error);
    return null;
  }

  return data;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  const { error } = await supabase
    .from('teams')
    .update({
      ...subscriptionData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', teamId);

  if (error) {
    console.error('Error updating team subscription:', error);
  }
}

export async function getUserWithTeam(userId: number) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      team_members!inner(
        team_id
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user with team:', error);
    return null;
  }

  return data;
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      id,
      action,
      timestamp,
      ip_address,
      users(name)
    `)
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }

  return data;
}

export async function getTeamForUser(userId: number) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      team_members!inner(
        team:teams(
          *,
          team_members(
            user:users(
              id,
              name,
              email
            )
          )
        )
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching team for user:', error);
    return null;
  }

  return data?.team_members[0]?.team || null;
}

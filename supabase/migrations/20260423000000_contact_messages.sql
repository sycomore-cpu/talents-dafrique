CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
-- Only service role (admin) can read/write
CREATE POLICY "Service role only" ON public.contact_messages USING (false);

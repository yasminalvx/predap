CREATE TABLE pelvic_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_name VARCHAR(255),
    sets INT NOT NULL,
    time_contracting INT NOT NULL, -- tempo apertando (em segundos)
    time_releasing INT NOT NULL,   -- tempo soltando (em segundos)
    rest_time INT NOT NULL,        -- tempo de descanso (em segundos)
    description text
);

ALTER TABLE pelvic_exercises
ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE TABLE treino (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,                
    professional_id UUID NOT NULL,            
    start_date DATE NOT NULL,               
    end_date DATE,                  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    ativo boolean default true,
    FOREIGN KEY (patient_id) REFERENCES auth.users(id),
    FOREIGN KEY (professional_id) REFERENCES auth.users(id)
);

ALTER TABLE treino
ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE TABLE treino_exercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treino_id UUID NOT NULL,               
    exercise_id UUID NOT NULL,              
    FOREIGN KEY (treino_id) REFERENCES treino(id) ON DELETE CASCADE, 
    FOREIGN KEY (exercise_id) REFERENCES pelvic_exercises(id) ON DELETE CASCADE
);

ALTER TABLE treino_exercicios
ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE TABLE treino_registro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treino_exercicio_id UUID NOT NULL,          
    patient_id UUID NOT NULL,                    
    date DATE NOT NULL,                          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (treino_exercicio_id) REFERENCES treino_exercicios(id) ON DELETE CASCADE, 
    FOREIGN KEY (patient_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE treino_registro
ALTER COLUMN id SET DEFAULT gen_random_uuid();

create view public.users as select id, raw_user_meta_data AS data  from auth.users;
revoke all on public.users from anon, authenticated;

GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

CREATE OR REPLACE FUNCTION public.get_treinos_profissional_data_uuid(p_data DATE, prof_id uuid)
RETURNS TABLE (
  treino_id UUID,
  treino_exercicio_id UUID,
  treino_registro_id UUID,
  professional_id UUID,
  patient_id UUID,
  patient_data JSONB,
  treino_registro_date TIMESTAMP,
  has_treino_registro BOOLEAN
) AS
$$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (t.id) 
    t.id AS treino_id,
    te.id AS treino_exercicio_id,
    tr.id AS treino_registro_id,
    u.id AS professional_id,
    u2.id AS patient_id,
    u2.data AS patient_data,
    tr.created_at AS treino_registro_date,
    EXISTS (
      SELECT 1
      FROM treino_registro tr2
      WHERE tr2.treino_exercicio_id = te.id 
        AND tr2.date = p_data
    ) AS has_treino_registro
  FROM 
    treino t
  JOIN 
    users u ON t.professional_id = u.id
  JOIN 
    users u2 ON t.patient_id = u2.id
  JOIN 
    treino_exercicios te ON te.treino_id = t.id
  LEFT JOIN 
    treino_registro tr ON tr.treino_exercicio_id = te.id
  WHERE
    (t.start_date <= p_data AND 
     (t.end_date IS NULL OR t.end_date >= p_data)) AND
     t.professional_id = prof_id
  ORDER BY t.id, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;
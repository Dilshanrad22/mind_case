// Utility: map exercise names/muscles to representative image URLs.
// For demo purposes we use curated Unsplash images with query params kept small.
// In production you would host your own thumbnails or obtain from an API with proper licensing.

const NAME_MAP = {
  'dumbbell bench press': 'https://images.unsplash.com/photo-1517963628607-8bce3aee07d6?auto=format&w=400&q=60',
  'bench press': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&w=400&q=60',
  'push-up': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&w=400&q=60',
  'squat': 'https://images.unsplash.com/photo-1571019613576-2b22c76aa47e?auto=format&w=400&q=60',
  'deadlift': 'https://images.unsplash.com/photo-1599058917212-d750089bc07c?auto=format&w=400&q=60',
  'plank': 'https://images.unsplash.com/photo-1599058917500-8d3b940c7f5a?auto=format&w=400&q=60',
  'burpee': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&w=400&q=60',
  'lunges': 'https://images.unsplash.com/photo-1579750680999-6d1b0bd12a0d?auto=format&w=400&q=60',
};

const MUSCLE_MAP = {
  chest: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&w=400&q=60',
  back: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=400&q=60',
  legs: 'https://images.unsplash.com/photo-1571019613576-2b22c76aa47e?auto=format&w=400&q=60',
  biceps: 'https://images.unsplash.com/photo-1599058917523-5e5cbd9a9d1e?auto=format&w=400&q=60',
  triceps: 'https://images.unsplash.com/photo-1584467735871-1f9d29f92f31?auto=format&w=400&q=60',
  shoulders: 'https://images.unsplash.com/photo-1517963628607-8bce3aee07d6?auto=format&w=400&q=60',
  abs: 'https://images.unsplash.com/photo-1599058917319-17d3aa0155d3?auto=format&w=400&q=60',
};

export function imageForExercise(ex) {
  if (!ex) return null;
  // prefer explicit mapping by name
  const nameKey = (ex.title || ex.name || '').toLowerCase();
  if (NAME_MAP[nameKey]) return NAME_MAP[nameKey];
  // fallback by muscle
  const muscleKey = (ex.muscle || '').toLowerCase();
  if (MUSCLE_MAP[muscleKey]) return MUSCLE_MAP[muscleKey];
  // generic fallback based on type query (Unsplash random topical)
  const keyword = muscleKey || (ex.type || '').toLowerCase() || 'fitness';
  return `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`;
}

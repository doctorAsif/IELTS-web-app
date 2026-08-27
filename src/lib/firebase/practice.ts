import { collection, query, where, getDocs, orderBy, getFirestore } from 'firebase/firestore';
import { PracticeItem } from '../types';

export const getPublishedPracticeItems = async (
  skill?: string,
  targetBandMin?: number
): Promise<PracticeItem[]> => {
  const db = getFirestore();
  let q = query(
    collection(db, 'practice'),
    where('status', '==', 'published')
  );

  // Firestore requires compound indexes for multiple filters, 
  // so we'll do basic filtering here and advanced filtering client-side if needed, 
  // or define the proper composite indexes in firestore.indexes.json.
  
  if (skill) {
    q = query(q, where('skill', '==', skill));
  }

  // Note: if you add more where clauses, ensure firestore.indexes.json is updated.
  // We'll sort by createdAt descending to get the newest practices first.
  q = query(q, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  
  const items: PracticeItem[] = [];
  snapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as PracticeItem);
  });

  // Client-side filter for target band if provided
  if (targetBandMin !== undefined) {
    return items.filter(item => item.targetBandMin >= targetBandMin);
  }

  return items;
};

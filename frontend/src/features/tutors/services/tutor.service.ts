import { apiClient } from '@/lib/apiClient';
import { TutorProfile, TutorSearchParams } from '../types';

// Mock data for development when backend is empty
const MOCK_TUTORS: TutorProfile[] = [
    {
        id: '1',
        userId: 'u1',
        bio: 'Passionate math tutor with 5 years of experience helping students ace their exams.',
        subjects: ['Mathematics', 'Calculus', 'Algebra'],
        hourlyRate: 25,
        user: { id: 'u1', name: 'Dr. Sarah Smith', image: '' },
        averageRating: 4.9,
        totalReviews: 42
    },
    {
        id: '2',
        userId: 'u2',
        bio: 'Native English speaker and certified ESL teacher. I make learning fun and effective.',
        subjects: ['English', 'Literature', 'ESL'],
        hourlyRate: 18,
        user: { id: 'u2', name: 'James Wilson', image: '' },
        averageRating: 4.7,
        totalReviews: 28
    },
    {
        id: '3',
        userId: 'u3',
        bio: 'Computer Science major specializing in Web Development and Python.',
        subjects: ['Programming', 'Python', 'React', 'JavaScript'],
        hourlyRate: 30,
        user: { id: 'u3', name: 'Emily Chen', image: '' },
        averageRating: 5.0,
        totalReviews: 15
    },
    {
        id: '4',
        userId: 'u4',
        bio: 'Physics enthusiast making complex concepts easy to understand.',
        subjects: ['Science', 'Physics', 'Chemistry'],
        hourlyRate: 22,
        user: { id: 'u4', name: 'Michael Brown', image: '' },
        averageRating: 4.8,
        totalReviews: 34
    }
];

export const tutorService = {
    async getAll(params?: TutorSearchParams): Promise<TutorProfile[]> {
        try {
            // Retrieve from API
            // const response = await apiClient.get('/tutors', { params });
            // return response.data.data;

            // Return Mock for Demo stability until backend has data
            // Filter logic for mock
            let results = [...MOCK_TUTORS];
            if (params?.query) {
                const q = params.query.toLowerCase();
                results = results.filter(t =>
                    t.user.name.toLowerCase().includes(q) ||
                    t.subjects.some(s => s.toLowerCase().includes(q))
                );
            }
            if (params?.subject) {
                results = results.filter(t => t.subjects.includes(params.subject!));
            }

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return results;
        } catch (error) {
            console.error("Failed to fetch tutors", error);
            return MOCK_TUTORS;
        }
    },

    async getById(id: string): Promise<TutorProfile | null> {
        try {
            // const response = await apiClient.get(`/tutors/${id}`);
            // return response.data.data;

            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_TUTORS.find(t => t.id === id) || null;
        } catch (error) {
            return null;
        }
    }
};

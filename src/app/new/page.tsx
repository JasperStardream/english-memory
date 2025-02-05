'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Volume2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(1, 'Word is required'),
  translation: z.string().min(1, 'Translation is required'),
  audio: z.instanceof(FileList).refine((files) => files?.length > 0, 'Audio file is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function NewVocabularyPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('text', data.text);
      formData.append('translation', data.translation);
      
      const audioFiles = data.audio as FileList;
      if (audioFiles?.length > 0) {
        formData.append('audio', audioFiles[0]);
      }

      const response = await fetch('/api/vocabulary', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        reset();
      }
    } catch (error) {
      console.error('Failed to create vocabulary item:', error);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Add New Vocabulary</h1>
        
        {/* Add new vocabulary form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Word/Phrase <span className="text-red-500">*</span>
              </label>
              <input
                {...register('text')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter word or phrase"
              />
              {errors.text && (
                <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Translation <span className="text-red-500">*</span>
              </label>
              <input
                {...register('translation')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter translation"
              />
              {errors.translation && (
                <p className="text-red-500 text-sm mt-1">{errors.translation.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Pronunciation Audio <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">(Supported formats: MP3, WAV, OGG)</span>
            </label>
            <input
              type="file"
              accept="audio/*"
              {...register('audio')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.audio && (
              <p className="text-red-500 text-sm mt-1">{errors.audio.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vocabulary
          </button>
        </form>


      </div>
    </div>
  );
}
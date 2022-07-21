import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ExerciseDetails } from './index';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ExerciseBase } from 'components/Exercises/models/exerciseBase';
import { ExerciseTranslation } from 'components/Exercises/models/exerciseTranslation';
import { getEquipment, getExerciseBase, getExerciseBases, getExerciseBasesForVariation, getLanguages } from "services";
import { QueryClient, QueryClientProvider } from "react-query";
import { testCategories, testEquipment, testMuscles } from "tests/exerciseTestdata";

jest.mock("services");

describe("Should render with", () => {

    const exerciseBase = new ExerciseBase(
        345,
        "c788d643-150a-4ac7-97ef-84643c6419bf",
        testCategories[1],
        [testEquipment[0], testEquipment[3]],
        [testMuscles[0], testMuscles[3]],
        [],
        [],
        null,
        [
            new ExerciseTranslation(111,
                '583281c7-2362-48e7-95d5-8fd6c455e0fb',
                'Squats',
                'Do a squat',
                2
            ),
            new ExerciseTranslation(9,
                'dae6f6ed-9408-4e62-a59a-1a33f4e8ab36',
                'Kniebeuge',
                'Kniebeuge machen',
                1
            )
        ]
    );

    beforeEach(() => {
        // since we used jest.mock(), getExerciseBase is a jest.fn() having no implementation
        // or doing nothing at all, so this implementation will resolve to our dummy data.
        // @ts-ignore
        getExerciseBase.mockImplementation(() => Promise.resolve(exerciseBase));
        // @ts-ignore
        getExerciseBases.mockImplementation(() => Promise.resolve([
            exerciseBase,
            exerciseBase,
            exerciseBase,
        ]));
        // @ts-ignore
        getExerciseBasesForVariation.mockImplementation(() => Promise.resolve(
            [
                // TODO: add some variations. Adding a helper function to create variations is probably a good idea.
                //exerciseBase,
                //exerciseBase,
                //exerciseBase,
            ]
        ));
        // @ts-ignore
        getLanguages.mockImplementation(() => Promise.resolve(languages));
    });

    test.skip('should render the exercise to screen', async () => {

        const queryClient = new QueryClient();
        await render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/exercises/9']}>
                    <Routes>
                        <Route path='exercises/:baseID' element={<ExerciseDetails />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await act(() => Promise.resolve());

        expect(getLanguages).toBeCalled();
        expect(getExerciseBase).toBeCalled();
        expect(getExerciseBasesForVariation).toBeCalled();


        await waitFor(() => {
            expect(screen.getByText("Squats")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(exerciseBase.muscles[0].name)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(exerciseBase.muscles[0].name)).toBeInTheDocument();
        });
        expect(screen.getByText('Variants')).toBeInTheDocument();
        expect(screen.getByText("VIEW")).toBeInTheDocument();

    });
});
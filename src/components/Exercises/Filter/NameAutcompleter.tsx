import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import throttle from 'lodash/throttle';
import { searchExerciseTranslations } from "services/exerciseTranslation";
import { ExerciseSearchResponse } from "services/responseType";
import { Box, Grid, Typography } from "@mui/material";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useTranslation } from "react-i18next";


export function NameAutocompleter() {
    const [value, setValue] = React.useState<ExerciseSearchResponse | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<readonly ExerciseSearchResponse[]>([]);
    const [t, i18n] = useTranslation();

    const fetchName = React.useMemo(
        () =>
            throttle(
                (
                    request: string,
                ) => {
                    searchExerciseTranslations(request).then(res => {
                        setOptions(res);
                    });
                },
                200,
            ),
        [],
    );


    React.useEffect(() => {

        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetchName(inputValue);

        return () => {
            active = false;
        };
    }, [value, inputValue, fetchName]);

    return (
        <Autocomplete
            id="exercise-name-autocomplete"
            getOptionLabel={(option) =>
                option.value
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(event: any, newValue: ExerciseSearchResponse | null) => {
                console.log('exercise selected!');
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label={t('search-exercise-name')} fullWidth />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                {option.data.image ?
                                    <Box
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            backgroundImage: `url(${option.data.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    :
                                    <Box
                                        component={InsertPhotoIcon}
                                        sx={{ color: 'text.secondary', mr: 2 }}
                                    />
                                }
                            </Grid>
                            <Grid item xs>
                                {option.value}
                                <Typography variant="body2" color="text.secondary">
                                    {(option.data.category)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
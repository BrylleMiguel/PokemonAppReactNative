import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as z from 'zod';

const pokemonSchema = z.object({ name: z.string(), sprites: z.object({ front_default: z.string() }) })
type Pokemon = z.infer<typeof pokemonSchema>

export default function PokemonDetail() {
   const [pokemon, setPokemon] = useState<string>("Gengar")
   const [userPokemonChoice, setUserPokemonChoice] = useState("")

   const fetchPokemon = async ({ queryKey, signal }: QueryFunctionContext<readonly [string, string]>): Promise<Pokemon> => {
      const [_key, pokemonName] = queryKey;
      const res = await axios.get(
         `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
         { signal }
      );
      return pokemonSchema.parse(res.data)
   };

   const pokemonQueryKey = (_pokemon: string) => ['pokemon_', _pokemon] as const;
   const { data, error, isLoading } = useQuery({
      queryKey: pokemonQueryKey(pokemon),
      queryFn: fetchPokemon,
      enabled: !!pokemon, // won't run if pokemon is "" / null /undefined (can be remove since pokemon has already a value of "Gengar")
      staleTime: 30 * 60 * 1000, // 30 mins
   });

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View>
            <TextInput style={styles.textInput} placeholder="e.g. Pikachu" value={userPokemonChoice} onChangeText={setUserPokemonChoice} />
            <Pressable style={styles.searchButton} onPress={() => setPokemon(userPokemonChoice.toLowerCase())} >
               <Text>Search Pokemon</Text>
            </Pressable>

            <View>
               {
                  isLoading ? <Text style={styles.loadingAndError}>loading...</Text> :
                     error ? <Text style={styles.loadingAndError}>error occured.</Text> :
                        null
               }
            </View>
         </View>

         <View style={styles.viewContainer}>
            <Text>{data?.name}</Text>
            <Image source={{ uri: data?.sprites?.front_default }} width={400} height={400} />
         </View>
         <View>

         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      padding: 10,
      backgroundColor: 'white'
   },
   viewContainer: {
      height: 700,
      backgroundColor: '#whitesmoke',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   },
   textInput: {
      padding: 10,
      color: '#fff',
      backgroundColor: '#333',
      borderRadius: 10,
   },
   searchButton: {
      padding: 10
   },
   loadingAndError: {
      padding: 10
   }
})

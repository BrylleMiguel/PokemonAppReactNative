import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

export default function Index() {

  const [pokemon, setPokemon] = useState<string>("")
  const [userPokemonChoice, setUserPokemonChoice] = useState("")

  const fetchPokemon = async ({ queryKey, signal }: QueryFunctionContext<[string, string]>) => {
    const [_key, pokemonName] = queryKey;
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      { signal }
    );
    return res.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: fetchPokemon,
    enabled: !!pokemon,
    staleTime: 30 * 60 * 1000, // 30 mins
  });

  console.log("pokemon:", pokemon)
  console.log("data name:", data?.name)

  return (
    <ScrollView>
      <View>{isLoading ? <Text>loading...</Text> : error ? <Text>error occured.</Text> : <Text></Text>}
      </View>
      <View>
        <TextInput style={{ color: '#fff', backgroundColor: '#333', padding: 10 }} placeholder="e.g. Pikachu" value={userPokemonChoice} onChangeText={setUserPokemonChoice} />
        <Button title="Search Pokemon" onPress={() => setPokemon(userPokemonChoice.toLowerCase())} />
      </View>
      <View>
        <Text>{data?.name}</Text>
      </View>
    </ScrollView>
  );
}

import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as z from 'zod';

const pokemonSchema = z.object({ name: z.string(), sprites: z.object({ front_default: z.string() }) })
type Pokemon = z.infer<typeof pokemonSchema>

export default function Index() {
	const [pokemon, setPokemon] = useState<string>("")
	const [userPokemonChoice, setUserPokemonChoice] = useState("")

	const fetchPokemon = async ({ queryKey, signal }: QueryFunctionContext<[string, string]>): Promise<Pokemon> => {
		const [_key, pokemonName] = queryKey;
		const res = await axios.get(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
			{ signal }
		);
		return pokemonSchema.parse(res.data)
	};

	const { data, error, isLoading } = useQuery({
		queryKey: ['pokemon', pokemon],
		queryFn: fetchPokemon,
		enabled: !!pokemon,
		staleTime: 30 * 60 * 1000, // 30 mins
	});

	return (
		<ScrollView style={{ padding: 10 }}>
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

			<View style={styles.container}>
				<Text>{data?.name}</Text>
				<Image source={{ uri: data?.sprites?.front_default }} width={100} height={100} />
			</View>
			<View>

			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#999',
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

/* -----------------------------
	Zod Schemas
----------------------------- */

const PokemonDetailSchema = z.object({ name: z.string(), sprites: z.object({ front_default: z.string(), }), });
type PokemonDetail = z.infer<typeof PokemonDetailSchema>;

const resultSchema = z.object({ name: z.string(), url: z.string(), });

const pokemonsSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(resultSchema),
});

/* -----------------------------
	Pokemon Component
----------------------------- */

function Pokemon({ pokemon }: { pokemon: PokemonDetail }) {
	return (
		<View style={styles.pokemon}>
			<Text style={styles.name}>{pokemon.name}</Text>
			<Image
				style={styles.image}
				source={{ uri: pokemon.sprites.front_default }}
			/>
		</View>
	);
}

/* -----------------------------
	Main Screen
----------------------------- */

export default function Index() {
	const fetchPokemons = async () => {
		const res = await axios.get(
			"https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"
		);

		const pokemons = pokemonsSchema.parse(res.data);

		// Fetch details in parallel
		const details = await Promise.all(
			pokemons.results.map(async ({ url }) => {
				const detailRes = await axios.get(url);
				return PokemonDetailSchema.parse(detailRes.data);
			})
		);

		return { details };
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ["pokemons"],
		queryFn: fetchPokemons,
		staleTime: 30 * 60 * 1000,
	});

	if (isLoading) return <Text>Loading...</Text>;
	if (error) return <Text>Error fetching Pokémon</Text>;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<FlatList
					<PokemonDetail>
					data={data?.details}
					keyExtractor={(pokemon) => pokemon.name}
					renderItem={({ item }) => <Pokemon pokemon={item} />}
					contentContainerStyle={styles.list}
					numColumns={3}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/* -----------------------------
	Styles
----------------------------- */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	list: {
		gap: 10,
	},
	pokemon: {
		alignItems: "center",
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#f2f2f2",
	},
	name: {
		fontSize: 18,
		fontWeight: "600",
		textTransform: "capitalize",
	},
	image: {
		width: 100,
		height: 100,
	},
});
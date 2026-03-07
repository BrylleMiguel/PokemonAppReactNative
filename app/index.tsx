
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Image, ScrollView, Text, View } from "react-native";
import * as z from "zod";

const PokemonDetailSchema = z.object({
	name: z.string(),
	sprites: z.object({ front_default: z.string() }),
});
type PokemonDetail = z.infer<typeof PokemonDetailSchema>;

const resultSchema = z.object({ name: z.string(), url: z.string() });
const pokemonsSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(resultSchema),
});

export default function Index() {
	// Fetch list + details
	const fetchPokemons = async (): Promise<{ details: PokemonDetail[] }> => {
		const res = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20");
		const pokemons = pokemonsSchema.parse(res.data);

		// Fetch all details in parallel
		const details = await Promise.all(
			pokemons.results.map(async ({ url }) => {
				const detailRes = await axios.get(url);
				return PokemonDetailSchema.parse(detailRes.data);
			})
		);

		return { details };
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ["pokemons"], // TanStack Query key
		queryFn: fetchPokemons,
		staleTime: 30 * 60 * 1000,
	})

	console.log(data?.details)

	if (isLoading) return <Text>Loading...</Text>;
	if (error) return <Text>Error fetching Pokémon</Text>;

	return <ScrollView>
		{data?.details.map(p => (
			<View>
				<Text key={p.name}>{p.name}</Text>
				<Image width={100} height={100} source={{ uri: p.sprites.front_default }} />
			</View>
		))}
	</ScrollView>;
}
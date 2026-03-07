import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollView } from "react-native";
import * as z from 'zod';

const resultSchema = z.object({ name: z.string(), url: z.string() })
const pokemonsSchema = z.object({ count: z.number(), next: z.string(), previous: z.string(), results: z.array(resultSchema) })
type Pokemons = z.infer<typeof pokemonsSchema>

export default function Index() {
	const fetchPokemons = async (): Promise<Pokemons> => {
		const res = await axios.get('https://pokeapi.co/api/v2/pokemon')
		return pokemonsSchema.parse(res.data)
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ["pokemons"],
		queryFn: () => fetchPokemons,
		staleTime: 30 * 60 * 1000, // 30 mins
	})

	return <ScrollView>

	</ScrollView>;
}


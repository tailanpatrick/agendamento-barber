"use client"
import { Button } from "@/app/_components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { useRouter } from "next/navigation";


const formSearchSchema = z.object({
    search: z.string().trim().min(1, { message: 'Digite a pesquisa' })
});

type FormSearch = z.infer<typeof formSearchSchema>
interface SearchProps {
    defaultValue?: FormSearch
}

const Search = ({defaultValue} : SearchProps) => {
    const router = useRouter();

    const form = useForm<FormSearch>({
        resolver: zodResolver(formSearchSchema),
        defaultValues: {
            search: defaultValue?.search ?? ''
        }
    })

    function handleSearchSubmit(data: FormSearch) {
        router.push(`/barbershops?search=${data.search}`);
    }

    return (
        <div className="w-full flex gap-2">
            <Form {...form}>
                <form className="w-full flex gap-4" onSubmit={form.handleSubmit(handleSearchSubmit)}>
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input placeholder="Busque por uma barbearia.." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button variant="default" type="submit">
                        <SearchIcon size={20} />
                    </Button>
                </form>
            </Form>
        </div >
    );
}

export default Search;
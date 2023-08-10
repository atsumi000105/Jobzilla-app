'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import loaderIcon from '@/assets/icons/loader.svg'
import ErrorMessage from '@/components/ErrorMessage'

export default function BuscadorEmpresas () {
	const [companies, setCompanies] = useState(null)
	const [error, setError] = useState(false)
	const [loading, setloading] = useState(false)

	function handleSubmit (e) {
		e.preventDefault()
		const formData = new FormData(e.target)

		setloading(true)
		if (formData.get('search').length > 0) {
			axios('/api/companies', {
				params: {
					search: formData.get('search')
				}
			})
				.then(res => setCompanies(res.data.items))
				.catch(() => setError(true))
				.finally(() => setloading(false))
		}
	}

	const errorText = error ? 'Ha ocurrido un error' : companies?.length === 0 && companies !== null ? 'No se han encontrado resultados' : ''

	return (
		<main>
			<h1 className='text-lg md:text-2xl my-6 text-center font-semibold'>Buscador de empresas</h1>
			<form onSubmit={handleSubmit} className='flex flex-col px-4 sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto'>
				<input type='text' placeholder='Infojobs, Adevinta, Adidas... ' name='search' className='w-full sm:w-auto  py-2 px-4 border dark:text-slate-900 border-slate-300 rounded-lg focus:outline-none focus:ring-2 flex-grow focus:ring-blue-600 focus:border-transparent z-10' required />
				<button type='submit' className={`${loading ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} w-full sm:w-auto py-2 px-6  text-white rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`} disabled={loading}>Buscar</button>
			</form>
			{
				loading && <Image src={loaderIcon} width={30} height={30} alt='Cargando...' className='mx-auto invert dark:invert-0 my-8' />

			}
			{
				!loading && errorText && <ErrorMessage message={errorText} />
			}
			{
				companies && companies.length > 0 && !loading && !error && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 mt-8'>
						{
							companies.map((company, i) => (
								<Link key={i} href={`/empresa?sdrn=${company.sdrn}`} className='bg-blue-100 p-4 rounded-md overflow-hidden hover:scale-[1.02] transition-all'>
									<section>
										<Image className='rounded-md'
											src={company.logo?.includes('null') ? '/company-logo.png' : company.logo}
											width={100} height={100}
											alt={`${company.name} logo`} />
										<h3 className='text-xl my-1 font-medium'>{company.name}</h3>
										<p className='companyShortDescription max-h-60' title={company.description}>{company.description}</p>
									</section>
								</Link>
							))
						}
					</div>
				)
			}
		</main>
	)
}

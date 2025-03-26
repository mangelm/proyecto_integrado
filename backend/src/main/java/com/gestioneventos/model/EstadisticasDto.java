package com.gestioneventos.model;

public class EstadisticasDto {
	 private int totalProductos;
	    private String categoriaMasPopular;
	    private double ingresosTotales;

	    public EstadisticasDto(int totalProductos, String categoriaMasPopular, double ingresosTotales) {
	        this.totalProductos = totalProductos;
	        this.categoriaMasPopular = categoriaMasPopular;
	        this.ingresosTotales = ingresosTotales;
	    }

		public int getTotalProductos() {
			return totalProductos;
		}

		public void setTotalProductos(int totalProductos) {
			this.totalProductos = totalProductos;
		}

		public String getCategoriaMasPopular() {
			return categoriaMasPopular;
		}

		public void setCategoriaMasPopular(String categoriaMasPopular) {
			this.categoriaMasPopular = categoriaMasPopular;
		}

		public double getIngresosTotales() {
			return ingresosTotales;
		}

		public void setIngresosTotales(double ingresosTotales) {
			this.ingresosTotales = ingresosTotales;
		}
	    
}

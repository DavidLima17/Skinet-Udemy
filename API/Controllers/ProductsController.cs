using Infastructure.Data;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Core.specifications;
using API.DTO;
using System.Collections.Generic;
using AutoMapper;
using API.errors;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductType> _typesRepo;
        private readonly IGenericRepository<ProductBrand> _brandsRepo;
        private readonly IMapper _mapper;
   
        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductType> typesRepo, IGenericRepository<ProductBrand> brandsRepo, IMapper mapper)
        {
            _mapper = mapper;
            _brandsRepo = brandsRepo;
            _typesRepo = typesRepo;
            _productsRepo = productsRepo;

        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductsToReturnDto>>> GetProducts(){

            var spec = new ProductsWithTypesAndBrandsSpecification();
            var products = await _productsRepo.ListAsync(spec);
            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductsToReturnDto>>(products));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType((typeof(ApiResponse)), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductsToReturnDto>> GetProduct(int id){
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductsToReturnDto>(product);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands(){
            return Ok(await _brandsRepo.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes(){
            return Ok(await _typesRepo.ListAllAsync());
        }
    }
}
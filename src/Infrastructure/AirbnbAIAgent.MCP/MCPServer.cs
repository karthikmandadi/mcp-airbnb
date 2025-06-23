using System.Text.Json;

namespace AirbnbAIAgent.MCP.Models;

public record MCPRequest(
    string Id,
    string Method,
    Dictionary<string, object> Params,
    DateTime Timestamp
);

public record MCPResponse(
    string Id,
    object? Result,
    MCPError? Error,
    DateTime Timestamp
);

public record MCPError(
    int Code,
    string Message,
    object? Data = null
);

public record MCPResource(
    string Uri,
    string Name,
    string? Description = null,
    string? MimeType = null,
    Dictionary<string, object>? Metadata = null
);

public record MCPTool(
    string Name,
    string Description,
    Dictionary<string, object> InputSchema
);

public abstract class MCPServer
{
    protected readonly Dictionary<string, MCPResource> _resources = new();
    protected readonly Dictionary<string, MCPTool> _tools = new();

    public abstract Task<MCPResponse> HandleRequestAsync(MCPRequest request);
    
    protected virtual Task<MCPResponse> ListResourcesAsync(MCPRequest request)
    {
        var resources = _resources.Values.ToList();
        return Task.FromResult(new MCPResponse(
            request.Id,
            new { resources },
            null,
            DateTime.UtcNow
        ));
    }

    protected virtual Task<MCPResponse> ListToolsAsync(MCPRequest request)
    {
        var tools = _tools.Values.ToList();
        return Task.FromResult(new MCPResponse(
            request.Id,
            new { tools },
            null,
            DateTime.UtcNow
        ));
    }

    protected virtual Task<MCPResponse> ReadResourceAsync(MCPRequest request)
    {
        if (!request.Params.TryGetValue("uri", out var uriObj) || uriObj is not string uri)
        {
            return Task.FromResult(new MCPResponse(
                request.Id,
                null,
                new MCPError(-32602, "Invalid uri parameter"),
                DateTime.UtcNow
            ));
        }

        if (!_resources.TryGetValue(uri, out var resource))
        {
            return Task.FromResult(new MCPResponse(
                request.Id,
                null,
                new MCPError(-32601, "Resource not found"),
                DateTime.UtcNow
            ));
        }

        return ReadResourceContentAsync(request, resource);
    }

    protected abstract Task<MCPResponse> ReadResourceContentAsync(MCPRequest request, MCPResource resource);
    protected abstract Task<MCPResponse> CallToolAsync(MCPRequest request);
}
